// src/doctor/doctor.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { DoctorController } from './doctor.controller';
import { Doctor, DoctorSchema } from './entities/doctor.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  controllers: [DoctorController],
  providers: [DoctorResolver, DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}