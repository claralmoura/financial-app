import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoriesModule,
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
