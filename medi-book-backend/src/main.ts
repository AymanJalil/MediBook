import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exception/http-exception.filter'; // direct import
// import { RateLimiterInterceptor } from './middleware/rate-limiter.interceptor'; // direct import
// import { CacheInterceptor } from './middleware/cache.interceptor'; // direct import
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost); // Ensure it is retrieved

  app.enableCors({
    origin: 'http://localhost:3030', // Frontend port
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  

  // Enable validation globally
  // In your main.ts or where you set up the ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.error('Validation Errors:', errors); // Log errors for debugging
        const messages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  // Enable exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  // Enable rate limiter globally (no Redis dependency)
  // app.useGlobalInterceptors(new RateLimiterInterceptor(configService));

  // Enable cache interceptor globally (no Redis dependency)
  // app.useGlobalInterceptors(new CacheInterceptor(configService));


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

  const port = configService.get<number>('PORT') || 3000; // Use for backend
  await app.listen(port);
  console.log('Server listening on port: ' + port);
}
bootstrap();
