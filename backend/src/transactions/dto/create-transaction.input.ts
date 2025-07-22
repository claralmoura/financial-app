import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'Descrição da transação' })
  description: string;

  @Field(() => Float, { description: 'Valor da transação' })
  value: number;

  @Field(() => String, { description: 'Tipo (income ou expense)' })
  @IsIn(['income', 'expense', 'card_expense'])
  type: 'income' | 'expense' | 'card_expense';

  @Field(() => Date, {
    nullable: true,
    description: 'Data da transação (opcional)',
  })
  date?: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  cardInvoiceId?: string;
}
