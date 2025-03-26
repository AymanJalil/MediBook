// create-auth.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, Matches } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @Field({ description: 'ID of the user', nullable: true })
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'ID must be a valid MongoDB ObjectId (24 hex characters)' })
  id?: string;

  @Field({ description: 'Username of the user' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @Field({ description: 'Email of the user' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field({ description: 'Password of the user' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field({ description: 'Role of the user', defaultValue: 'admin' })
  role: string;
}