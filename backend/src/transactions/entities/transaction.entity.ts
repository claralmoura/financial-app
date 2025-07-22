import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { CardInvoiceEntity } from 'src/card-invoices/entities/card-invoice.entity';

@ObjectType()
export class TransactionEntity {
  @Field(() => ID, { description: 'ID único da transação' })
  _id: string;

  @Field(() => String, { description: 'Descrição da transação' })
  description: string;

  @Field(() => Float, { description: 'Valor da transação' })
  value: number;

  @Field(() => String, { description: 'Tipo (income ou expense)' })
  type: string;

  @Field(() => Date, { description: 'Data da transação' })
  date: Date;

  @Field(() => CategoryEntity, { nullable: true })
  category?: CategoryEntity;

  @Field(() => ID, { description: 'ID do usuário dono da transação' })
  userId: string;

  @Field(() => CardInvoiceEntity, { nullable: true })
  cardInvoice?: CardInvoiceEntity;
}
