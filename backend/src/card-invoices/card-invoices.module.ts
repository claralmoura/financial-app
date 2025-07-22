import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardInvoicesService } from './card-invoices.service';
import { CardInvoicesResolver } from './card-invoices.resolver';
import { CardInvoice, CardInvoiceSchema } from './schemas/card-invoice.schema';
import {
  CreditCard,
  CreditCardSchema,
} from 'src/credit-cards/schemas/credit-card.schema';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';
import { CreditCardsModule } from 'src/credit-cards/credit-cards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardInvoice.name, schema: CardInvoiceSchema },
      { name: CreditCard.name, schema: CreditCardSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    CreditCardsModule,
  ],
  providers: [CardInvoicesResolver, CardInvoicesService],
})
export class CardInvoicesModule {}
