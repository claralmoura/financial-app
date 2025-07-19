import { InputType, Field } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';
}
