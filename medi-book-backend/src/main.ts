import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exception/http-exception.filter'; // direct import
import { RateLimiterInterceptor } from './middleware/rate-limiter.interceptor'; // direct import
import { CacheInterceptor } from './middleware/cache.interceptor'; // direct import
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost); // Ensure it is retrieved

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  // Enable rate limiter globally (inject Redis client)
  const redisClient = app.get('RedisClient'); // Retrieve Redis client
  app.useGlobalInterceptors(
    new RateLimiterInterceptor(configService, redisClient)
  );

  // Enable cache interceptor globally (inject CacheManager and ConfigService)
  const cacheManager = app.get('CACHE_MANAGER');
  app.useGlobalInterceptors(new CacheInterceptor(cacheManager, configService));


  // Enable Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MediBook API')
    .setDescription('API documentation for MediBook application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // path to access swagger

  // Enable request IP middleware
  app.use(requestIp.mw());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log('Server listening on port: ' + port);
}
bootstrap();
