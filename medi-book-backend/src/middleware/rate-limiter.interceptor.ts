import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerException } from './throttler.exception';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private rateLimiter: RateLimiterRedis;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisClient: Redis
  ) {
    this.rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rateLimiter',
      points: this.configService.get<number>('RATE_LIMIT_POINTS', 10), // Default: 10 requests
      duration: this.configService.get<number>('RATE_LIMIT_TTL', 60), // Default: 60 seconds
      blockDuration: 0,
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress; // Fallback for IP extraction

    try {
      await this.rateLimiter.consume(ip, 1);
      return next.handle();
    } catch (error) {
      if (error instanceof Error) {
        throw new ThrottlerException();
      }
      throw error;
    }
  }
}
