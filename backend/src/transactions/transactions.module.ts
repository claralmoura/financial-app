import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import { CardInvoicesModule } from 'src/card-invoices/card-invoices.module';
import { CreditCardsModule } from 'src/credit-cards/credit-cards.module';
import {
  FixedExpense,
  FixedExpenseSchema,
} from 'src/fixed-expenses/schemas/fixed-expense.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import {
  CardInvoice,
  CardInvoiceSchema,
} from 'src/card-invoices/schemas/card-invoice.schema';
import {
  CreditCard,
  CreditCardSchema,
} from 'src/credit-cards/schemas/credit-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Category.name, schema: CategorySchema },
      { name: FixedExpense.name, schema: FixedExpenseSchema },
      { name: CardInvoice.name, schema: CardInvoiceSchema },
      { name: CreditCard.name, schema: CreditCardSchema },
    ]),
    CategoriesModule,
    CardInvoicesModule,
    CreditCardsModule,
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
