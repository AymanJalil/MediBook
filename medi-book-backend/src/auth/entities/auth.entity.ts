import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql'; // Import ObjectType and Field

export type AuthDocument = Auth & Document;

@ObjectType() // Add ObjectType decorator
@Schema()
export class Auth {
  @Field(() => ID) // Add Field decorator for id
  _id: string;

  @Field() // Add Field decorator
  @Prop({ required: true, unique: true })
  username: string;

  @Field() // Add Field decorator
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field() // Add Field decorator
  @Prop({ required: true, default: 'admin' })
  role: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
