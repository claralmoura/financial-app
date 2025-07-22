import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  FixedExpense,
  FixedExpenseSchema,
} from 'src/fixed-expenses/schemas/fixed-expense.schema';
import {
  CardInvoice,
  CardInvoiceSchema,
} from 'src/card-invoices/schemas/card-invoice.schema';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FixedExpense.name, schema: FixedExpenseSchema },
      { name: CardInvoice.name, schema: CardInvoiceSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [NotificationsService],
})
export class NotificationsModule {}
