import { CurrentUser } from 'src/auth/current-user.decorator';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => TransactionEntity)
@UseGuards(JwtAuthGuard)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionEntity, { name: 'createTransaction' })
  createTransaction(
    @CurrentUser() user: any,
    @Args('input') createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.create(user.userId, createTransactionInput);
  }

  @Query(() => [TransactionEntity], { name: 'transactions' })
  findAll(@CurrentUser() user: any) {
    return this.transactionsService.findAll(user.userId);
  }

  @Mutation(() => TransactionEntity, { name: 'updateTransaction' })
  updateTransaction(
    @CurrentUser() user: any,
    @Args('input') updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionsService.update(user.userId, updateTransactionInput);
  }

  @Mutation(() => TransactionEntity, { name: 'deleteTransaction' })
  removeTransaction(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.transactionsService.remove(user.userId, id);
  }
}
