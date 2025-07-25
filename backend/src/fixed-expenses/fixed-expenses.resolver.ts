import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FixedExpensesService } from './fixed-expenses.service';
import { FixedExpenseEntity } from './entities/fixed-expense.entity';
import { CreateFixedExpenseInput } from './dto/create-fixed-expense.input';
import { UpdateFixedExpenseInput } from './dto/update-fixed-expense.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { FixedExpenseDocument } from './schemas/fixed-expense.schema';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Resolver(() => FixedExpenseEntity)
@UseGuards(JwtAuthGuard)
export class FixedExpensesResolver {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @Mutation(() => FixedExpenseEntity, { name: 'createFixedExpense' })
  createFixedExpense(
    @CurrentUser() user: any,
    @Args('input') createFixedExpenseInput: CreateFixedExpenseInput,
  ) {
    return this.fixedExpensesService.create(
      user.userId,
      createFixedExpenseInput,
    );
  }

  @Query(() => [FixedExpenseEntity], { name: 'fixedExpenses' })
  findAll(@CurrentUser() user: any) {
    return this.fixedExpensesService.findAllByUserId(user.userId);
  }

  @Mutation(() => FixedExpenseEntity, { name: 'updateFixedExpense' })
  updateFixedExpense(
    @CurrentUser() user: any,
    @Args('input') updateFixedExpenseInput: UpdateFixedExpenseInput,
  ) {
    return this.fixedExpensesService.update(
      user.userId,
      updateFixedExpenseInput,
    );
  }

  @Mutation(() => FixedExpenseEntity, { name: 'removeFixedExpense' })
  removeFixedExpense(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.fixedExpensesService.remove(user.userId, id);
  }

  @ResolveField('category', () => CategoryEntity, { nullable: true })
  getCategory(@Parent() fixedExpense: FixedExpenseDocument) {
    return fixedExpense.categoryId;
  }
}
