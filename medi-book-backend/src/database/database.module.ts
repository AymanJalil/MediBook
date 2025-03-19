import { Module, Global, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';  // Import AuthModule
import { DatabaseInitializerService } from './database-initializer.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => AuthModule),  // ForwardRef is still necessary
  ],
  providers: [DatabaseInitializerService],
  exports: [DatabaseInitializerService],  // Export if needed elsewhere
})
export class DatabaseModule {}
