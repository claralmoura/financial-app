import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetEmail(user: User, token: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Redefinição de Senha - Minhas Finanças',
      template: './password-reset',

      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendPaymentReminderEmail(user: User, bills: any[]) {
    const formattedBills = bills.map((bill) => ({
      ...bill,
      dueDate: new Intl.DateTimeFormat('pt-BR').format(bill.dueDate),
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(bill.value),
    }));

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Você tem contas prestes a vencer!',
      template: './payment-reminder',
      context: {
        name: user.name,
        bills: formattedBills,
      },
    });
  }
}
