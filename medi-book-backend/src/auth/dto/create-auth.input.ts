import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field({ description: 'ID of the user' })
  id: string;

  @Field({ description: 'Username of the user' })
  username: string;

  @Field({ description: 'Email of the user' })
  email: string;

  @Field({ description: 'Password of the user' })
  password: string;

  @Field({ description: 'Role of the user', defaultValue: 'user' })
  role: string;
}
