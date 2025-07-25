import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import {
  FixedExpense,
  FixedExpenseDocument,
} from 'src/fixed-expenses/schemas/fixed-expense.schema';
import {
  CardInvoice,
  CardInvoiceDocument,
} from 'src/card-invoices/schemas/card-invoice.schema';
import { EmailService } from 'src/email/email.service';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(FixedExpense.name)
    private fixedExpenseModel: Model<FixedExpenseDocument>,
    @InjectModel(CardInvoice.name)
    private cardInvoiceModel: Model<CardInvoiceDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: 'payment_reminders',
    timeZone: 'America/Fortaleza',
  })
  async handlePaymentReminders() {
    this.logger.log('Iniciando rotina de lembretes de pagamento...');

    const usersToNotify = await this.userModel.find({
      notificationsEnabled: true,
    });
    if (!usersToNotify?.length) {
      this.logger.log(
        'Nenhum usuário com notificações ativadas. Rotina finalizada.',
      );
      return;
    }

    const today = new Date();
    const reminderDays = 3;

    for (const user of usersToNotify) {
      const upcomingBills: {
        description: string;
        dueDate: Date;
        value: number;
      }[] = [];

      const fixedExpenses = await this.fixedExpenseModel.find({
        userId: user._id,
        isActive: true,
      });
      for (const expense of fixedExpenses) {
        const dueDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          expense.dueDate,
        );
        const diffDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays >= 0 && diffDays <= reminderDays) {
          upcomingBills.push({
            description: expense.description,
            dueDate,
            value: expense.value,
          });
        }
      }

      const closedInvoices = await this.cardInvoiceModel
        .find({ userId: user._id, status: 'CLOSED' })
        .populate('creditCardId');
      for (const invoice of closedInvoices) {
        const card = invoice.creditCardId as any;
        if (!card) continue;

        const dueDate = new Date(invoice.year, invoice.month, card.dueDay);
        const diffDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays >= 0 && diffDays <= reminderDays) {
          const transactions = await this.transactionModel.find({
            cardInvoiceId: invoice._id,
          });
          const totalValue = transactions.reduce((sum, t) => sum + t.value, 0);
          upcomingBills.push({
            description: `Fatura ${card.name}`,
            dueDate,
            value: totalValue,
          });
        }
      }

      if (upcomingBills?.length) {
        this.logger.log(
          `Enviando lembrete para ${user.email} com ${upcomingBills.length} conta(s).`,
        );
        await this.emailService.sendPaymentReminderEmail(user, upcomingBills);
      }
    }

    this.logger.log('Rotina de lembretes de pagamento finalizada.');
  }
}
