import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const isCacheEnabled = this.configService.get<boolean>('CACHE_ENABLED');
    if (!isCacheEnabled) {
      return next.handle();
    }

    const request: any = context.switchToHttp().getRequest(); // casting request to any
    const key = this.generateCacheKey(request);

    const cachedData = await this.cacheManager.get(key);
    if (cachedData) {
      return cachedData;
    }

    return next.handle().toPromise().then(response => {
      this.cacheManager.set(key, response, this.configService.get<number>('REDIS_TTL') || 60); // default ttl value
      return response;
    });
  }

  private generateCacheKey(request: any): string { // casting request to any
    const { method, url, body, query } = request;
    const baseKey = `cache:${method}:${url}`;
    const params = { body, query };
    const paramsHash = JSON.stringify(params);
    return `${baseKey}:${paramsHash}`;
  }
}
