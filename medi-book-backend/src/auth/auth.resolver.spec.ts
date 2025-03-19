import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthModule],
      providers: [AuthResolver, AuthService],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  }, 10000);

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
