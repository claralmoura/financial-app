import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'Descrição da transação' })
  description: string;

  @Field(() => Float, { description: 'Valor da transação' })
  value: number;

  @Field(() => String, { description: 'Tipo (income ou expense)' })
  type: 'income' | 'expense';

  @Field(() => Date, {
    nullable: true,
    description: 'Data da transação (opcional)',
  })
  date?: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string;
}
