import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CategoryEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  type: string;
}
