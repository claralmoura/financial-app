import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateCreditCardInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Int)
  @Min(1)
  @Max(31)
  closingDay: number;

  @Field(() => Int)
  @Min(1)
  @Max(31)
  dueDay: number;
}
