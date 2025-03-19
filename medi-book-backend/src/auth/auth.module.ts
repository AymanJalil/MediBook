import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';
import { DatabaseModule } from '../database/database.module';
import { DatabaseInitializerService } from '../database/database-initializer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),  // Define the model
    forwardRef(() => DatabaseModule),  // Avoid circular dependency
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService, MongooseModule],  // Export MongooseModule
})
export class AuthModule {}
