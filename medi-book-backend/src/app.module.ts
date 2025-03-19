import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { GuardModule } from './guard/guard.module';
import { DecoratorModule } from './decorator/decorator.module';
import { ExceptionModule } from './exception/exception.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { DoctorModule } from './doctor/doctor.module';
import { GenericController } from './generic.controller';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import * as redisStore from 'cache-manager-redis-store';
import { Redis } from 'ioredis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const useRedis = configService.get<boolean>('USE_REDIS', true);

        if (!useRedis) {
          console.log('⚠️ Redis is disabled. Using in-memory cache.');
          return { store: 'memory', ttl: 60 };
        }

        return {
          store: redisStore,
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          ttl: 60,
        };
      },
    }),
    DoctorModule,
    AuthModule,
    FileUploadModule,
    MiddlewareModule,
    ExceptionModule,
    DecoratorModule,
    CommonModule,
    DatabaseModule,
    GuardModule,
  ],
  controllers: [AppController, GenericController],
  providers: [
    AppService,
    {
      provide: 'RedisClient',
      useFactory: (configService: ConfigService) => {
        const useRedis = configService.get<boolean>('USE_REDIS', true);
        if (!useRedis) {
          console.log('⚠️ RedisClient is disabled.');
          return null;
        }
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        });
      },
      inject: [ConfigService],
    },
    // { // Removed HttpExceptionFilter provider to disable it
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
  exports: ['RedisClient'],
})
export class AppModule {}
