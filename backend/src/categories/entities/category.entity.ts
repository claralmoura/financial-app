import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CategoryEntity {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;
}
