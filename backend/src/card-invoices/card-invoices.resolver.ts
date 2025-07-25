import {
  Resolver,
  Query,
  Parent,
  ResolveField,
  ID,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CardInvoicesService } from './card-invoices.service';
import { CardInvoiceEntity } from './entities/card-invoice.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { CreditCardEntity } from 'src/credit-cards/entities/credit-card.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { CardInvoiceDocument } from './schemas/card-invoice.schema';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Resolver(() => CardInvoiceEntity)
@UseGuards(JwtAuthGuard)
export class CardInvoicesResolver {
  constructor(
    private readonly cardInvoicesService: CardInvoicesService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  @Query(() => [CardInvoiceEntity], { name: 'cardInvoices' })
  findAll(
    @CurrentUser() user: any,
    @Args('creditCardId', { type: () => ID, nullable: true })
    creditCardId?: string,
  ) {
    return this.cardInvoicesService.findAll(user.userId, creditCardId);
  }

  @ResolveField('creditCard', () => CreditCardEntity, { nullable: true })
  getCreditCard(@Parent() invoice: CardInvoiceDocument) {
    return invoice.creditCardId;
  }

  @ResolveField('transactions', () => [TransactionEntity])
  async getTransactions(@Parent() invoice: CardInvoiceEntity) {
    const { _id } = invoice;
    return this.transactionModel
      .find({ cardInvoiceId: _id })
      .populate('categoryId')
      .exec();
  }

  @Mutation(() => CardInvoiceEntity, { name: 'createManualInvoice' })
  createManualInvoice(
    @CurrentUser() user: any,
    @Args('input') input: CreateInvoiceInput,
  ) {
    return this.cardInvoicesService.createManual(user.userId, input);
  }
}
