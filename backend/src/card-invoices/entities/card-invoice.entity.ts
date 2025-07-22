import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CreditCardEntity } from 'src/credit-cards/entities/credit-card.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';

@ObjectType()
export class CardInvoiceEntity {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field()
  status: string;

  @Field(() => CreditCardEntity, { nullable: true })
  creditCard?: CreditCardEntity;

  @Field(() => [TransactionEntity], { nullable: 'itemsAndList' })
  transactions?: TransactionEntity[];
}
