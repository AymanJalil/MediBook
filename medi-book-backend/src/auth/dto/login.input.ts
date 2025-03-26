// login.input.ts - Create this file
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsNotEmpty()
  password: string;
  
  @Field({ defaultValue: false, nullable: true })
  requireAdmin?: boolean;
}