// middleware/cache.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.switchToHttp().getRequest().method !== 'GET') {
      return next.handle();
    }

    const url = context.switchToHttp().getRequest().url;
    const cacheKey = url;
    const ttl = this.configService.get('CACHE_TTL', 60) * 1000; // Convert to milliseconds

    const cachedItem = this.cache.get(cacheKey);
    if (cachedItem && cachedItem.expiry > Date.now()) {
      return of(cachedItem.data);
    }

    return next.handle().pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          expiry: Date.now() + ttl
        });
      })
    );
  }
}