import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createDoctorInput: CreateDoctorInput): Promise<Doctor> {
    const createdDoctor = new this.doctorModel(createDoctorInput);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async findByEmail(email: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findOne({ email }).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with email ${email} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorInput: Partial<Doctor>): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(
      id, 
      updateDoctorInput, 
      { new: true }
    ).exec();
    
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return updatedDoctor;
  }

  async remove(id: string): Promise<Doctor> {
    const deletedDoctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!deletedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return deletedDoctor;
  }
}