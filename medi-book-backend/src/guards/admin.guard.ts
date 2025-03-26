// Updated AdminGuard - Create or modify this file
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        console.error('🚨 No token provided');
        throw new UnauthorizedException('No token provided');
      }
      
      console.log('🔍 Received Token:', token);

      const payload = this.jwtService.verify(token);
      console.log('🔍 Decoded Payload:', payload);

      const user = await this.authService.validateUser(payload);
      console.log('🔍 Validated User:', user);
      
      // Set user in request object
      req.user = user;
      
      // Check if user is an admin
      if (user.role !== 'admin') {
        console.error('🚨 Access Denied: User is not an admin');
        throw new UnauthorizedException('Admin access required');
      }
      
      return true;
    } catch (error) {
      console.error('🚨 Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token or insufficient permissions');
    }
  }
}