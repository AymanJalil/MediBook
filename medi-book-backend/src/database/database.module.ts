// database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseInitializerService } from '../database-initializer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/medibook'),
      }),
    }),
  ],
  providers: [DatabaseInitializerService],
  exports: [MongooseModule, DatabaseInitializerService],
})
export class DatabaseModule {}