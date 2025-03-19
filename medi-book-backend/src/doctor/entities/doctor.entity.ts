import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

export type DoctorDocument = Doctor & Document;

@ObjectType()
@Schema()
export class Doctor {
  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  specialization: string;

  @Field()
  @Prop({ required: true, unique: true })
  contactInfo: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
