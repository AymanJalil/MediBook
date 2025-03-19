import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => Doctor, { name: 'createDoctor' })
  createDoctor(@Args('createDoctorInput') createDoctorInput: CreateDoctorInput) {
    return this.doctorService.create(createDoctorInput);
  }
}
