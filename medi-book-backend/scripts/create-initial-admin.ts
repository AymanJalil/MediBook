// scripts/create-initial-admin.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { Types } from 'mongoose'; // Import Types from mongoose

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Generate a valid MongoDB ObjectId
    const objectId = new Types.ObjectId().toString();
    
    const admin = await authService.createAdminUser({
      id: objectId, // Use a valid MongoDB ObjectId
      username: 'abd',
      email: 'admin@next.com',
      password: 'Abd@2025',
      role: 'admin'
    });
    
    console.log('Initial admin user created successfully:');
    console.log({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();