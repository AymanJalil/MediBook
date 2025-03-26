import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { GuardModule } from './guard/guard.module';
import { DecoratorModule } from './decorator/decorator.module';
import { ExceptionModule } from './exception/exception.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { DoctorModule } from './doctor/doctor.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_FILTER } from '@nestjs/core'; 
import { join } from 'path';

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
         console.log('🔧 Using in-memory cache system');
         return { 
           store: 'memory', 
           ttl: configService.get<number>('CACHE_TTL', 60) 
         };
       },
     }),
     DatabaseModule,
     AuthModule,
     DoctorModule,
     FileUploadModule,
     MiddlewareModule,
     ExceptionModule,
     DecoratorModule,
     CommonModule,
     GuardModule,
  ],
  controllers: [AppController], // Removed GenericController
  providers: [
    AppService,
     {
       provide: APP_FILTER,
       useClass: HttpExceptionFilter,
     },
  ],
})
export class AppModule {}