import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CreditCardEntity {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  closingDay?: number;

  @Field(() => Int, { nullable: true })
  dueDay?: number;
}
