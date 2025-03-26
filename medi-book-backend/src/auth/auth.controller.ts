// auth.controller.ts (if you want REST endpoints as well)
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { AdminGuard } from '../guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() createAuthInput: CreateAuthInput) {
    return this.authService.createAdminUser(createAuthInput);
  }
  
  @Post('user')
  @UseGuards(AdminGuard)
  async createUser(@Body() createAuthInput: CreateAuthInput) {
    return this.authService.createUser(createAuthInput);
  }
}