// src/doctor/dto/create-doctor.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

@InputType()
export class CreateDoctorInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  specialization: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  //@IsPhoneNumber()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  profileImage?: string;
}