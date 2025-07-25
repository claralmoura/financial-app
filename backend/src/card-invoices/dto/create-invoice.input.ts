import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsMongoId, IsInt, Max, Min } from 'class-validator';

@InputType()
export class CreateInvoiceInput {
  @Field(() => ID)
  @IsMongoId()
  creditCardId: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(11)
  month: number; // 0-11

  @Field(() => Int)
  @IsInt()
  year: number;
}
