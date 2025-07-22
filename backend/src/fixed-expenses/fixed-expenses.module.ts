import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixedExpensesService } from './fixed-expenses.service';
import { FixedExpensesResolver } from './fixed-expenses.resolver';
import {
  FixedExpense,
  FixedExpenseSchema,
} from './schemas/fixed-expense.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FixedExpense.name, schema: FixedExpenseSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoriesModule,
  ],
  providers: [FixedExpensesResolver, FixedExpensesService],
})
export class FixedExpensesModule {}
