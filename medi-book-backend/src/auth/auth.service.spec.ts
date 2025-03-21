import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  }, 10000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
