// src/doctor/dto/update-doctor.input.ts
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateDoctorInput } from './create-doctor.input';

@InputType()
export class UpdateDoctorInput extends PartialType(CreateDoctorInput) {
  @Field(() => ID)
  id: string;
}