import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateFixedExpenseInput } from './create-fixed-expense.input';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateFixedExpenseInput extends PartialType(
  CreateFixedExpenseInput,
) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
