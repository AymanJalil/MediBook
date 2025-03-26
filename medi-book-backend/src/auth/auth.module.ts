// auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Auth, AuthSchema } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminGuard } from '../guards/admin.guard';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '25efadcd86562fee482de51441c6b393139beef70198b97bc214eeed4d6a18c6',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}