// src/doctor/entities/doctor.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

export type DoctorDocument = Doctor & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Doctor {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  specialization: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  phone: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field({ nullable: true })
  @Prop()
  profileImage?: string;

  @Field(() => Boolean, { defaultValue: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);