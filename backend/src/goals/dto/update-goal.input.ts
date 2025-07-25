import { InputType, Field, ID, PartialType, Float } from '@nestjs/graphql';
import { CreateGoalInput } from './create-goal.input';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateGoalInput extends PartialType(CreateGoalInput) {
  @Field(() => ID)
  id: string;
}

@InputType()
export class AddToGoalInput {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  value: number;
}

@InputType()
export class SubtractFromGoalInput {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  value: number;
}
