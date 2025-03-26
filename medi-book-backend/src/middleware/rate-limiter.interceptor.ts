// middleware/rate-limiter.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private rateLimiter: RateLimiterMemory;

  constructor(private configService: ConfigService) {
    // Create an in-memory rate limiter
    this.rateLimiter = new RateLimiterMemory({
      points: this.configService.get('RATE_LIMIT_POINTS', 100),
      duration: this.configService.get('RATE_LIMIT_DURATION', 60),
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.clientIp || request.ip;

    try {
      await this.rateLimiter.consume(ip);
      return next.handle();
    } catch (error) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}