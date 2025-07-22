import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class GoalEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field(() => Float)
  targetValue: number;

  @Field(() => Float)
  currentValue: number;
}
