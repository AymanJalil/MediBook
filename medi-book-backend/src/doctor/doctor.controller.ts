// src/doctor/doctor.controller.ts (Optional REST API endpoint)
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorInput } from './dto/create-doctor.input';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() createDoctorInput: CreateDoctorInput) {
    return this.doctorService.create(createDoctorInput);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }
}