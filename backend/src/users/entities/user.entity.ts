import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
  @Field(() => ID, { description: 'ID único do usuário' })
  _id: string;

  @Field(() => String, { description: 'Nome do usuário' })
  name: string;

  @Field(() => String, { description: 'Email do usuário' })
  email: string;
}
