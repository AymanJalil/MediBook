// login-response.ts - Create this file
import { ObjectType, Field } from '@nestjs/graphql';
import { Auth } from '../entities/auth.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => Auth)
  user: Auth;
}