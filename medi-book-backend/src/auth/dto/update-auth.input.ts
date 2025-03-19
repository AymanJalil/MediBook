import { CreateAuthInput } from './create-auth.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  @Field({ description: 'ID of the user' })
  id: string;
}
