import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login-response';
import { UseGuards, UnauthorizedException  } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  @UseGuards(AdminGuard) // Protect this route with admin guard
  async createAdmin(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
  ): Promise<Auth> {
    return this.authService.createAdminUser(createAuthInput);
  }
  
  // If you want to expose a mutation for creating regular users
  @Mutation(() => Auth)
  @UseGuards(AdminGuard) // Only admins can create users
  async createUser(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
  ): Promise<Auth> {
    return this.authService.createUser(createAuthInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }
  
  @Mutation(() => LoginResponse)
  async adminLogin(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    // Set requireAdmin to true for admin login
    loginInput.requireAdmin = true;
    return this.authService.login(loginInput);
  }
  
  @Query(() => Auth)
  @UseGuards(AdminGuard)
  async getAdminProfile(@Args('id') id: string): Promise<Auth> {
    const user = await this.authService.validateUser({ sub: id });
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return user;
  }
}