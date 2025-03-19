import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { faker } from '@faker-js/faker';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async create(createDoctorInput: CreateDoctorInput): Promise<Doctor> {
    try {
      // Data validation
      if (!createDoctorInput.name || !createDoctorInput.specialization || !createDoctorInput.contactInfo) {
        throw new BadRequestException('All fields are required: name, specialization, contactInfo');
      }

      const createdDoctor = new this.doctorModel(createDoctorInput);
      return await createdDoctor.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle database errors or other unexpected errors
      throw new BadRequestException(`Failed to create doctor: ${error.message}`);
    }
  }

  async createRandomDoctor(): Promise<Doctor> {
    const createDoctorInput: CreateDoctorInput = {
      name: faker.person.fullName(),
      specialization: faker.lorem.word(),
      contactInfo: faker.internet.email(),
    };
    return this.create(createDoctorInput);
  }
}
