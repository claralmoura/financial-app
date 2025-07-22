import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateCreditCardInput } from './create-credit-card.input';

@InputType()
export class UpdateCreditCardInput extends PartialType(CreateCreditCardInput) {
  @Field(() => ID)
  id: string;
}
