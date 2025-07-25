import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsResolver } from './credit-cards.resolver';
import { CreditCard, CreditCardSchema } from './schemas/credit-card.schema';
import {
  CardInvoice,
  CardInvoiceSchema,
} from 'src/card-invoices/schemas/card-invoice.schema';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditCard.name, schema: CreditCardSchema },
      { name: CardInvoice.name, schema: CardInvoiceSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [CreditCardsResolver, CreditCardsService],
})
export class CreditCardsModule {}
