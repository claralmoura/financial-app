import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@ObjectType()
export class FixedExpenseEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  description: string;

  @Field(() => Float)
  value: number;

  @Field(() => Int)
  dueDate: number;

  @Field()
  isActive: boolean;

  @Field(() => CategoryEntity, { nullable: true })
  category?: CategoryEntity;
}
