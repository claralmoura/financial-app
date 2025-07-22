import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateFixedExpenseInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  value: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDate: number;

  @Field(() => ID)
  @IsMongoId()
  categoryId: string;
}
