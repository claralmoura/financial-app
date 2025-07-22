import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CardInvoice,
  CardInvoiceDocument,
} from './schemas/card-invoice.schema';
import {
  CreditCard,
  CreditCardDocument,
} from 'src/credit-cards/schemas/credit-card.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CardInvoicesService {
  private readonly logger = new Logger(CardInvoicesService.name);

  constructor(
    @InjectModel(CardInvoice.name)
    private cardInvoiceModel: Model<CardInvoiceDocument>,
    @InjectModel(CreditCard.name)
    private creditCardModel: Model<CreditCardDocument>,
  ) {}

  async findAllByUserId(userId: string): Promise<CardInvoice[]> {
    return this.cardInvoiceModel
      .find({ userId })
      .populate('creditCardId')
      .exec();
  }

  async findAllByCardId(
    userId: string,
    creditCardId: string,
  ): Promise<CardInvoice[]> {
    return this.cardInvoiceModel
      .find({ userId, creditCardId })
      .sort({ year: -1, month: -1 })
      .exec();
  }

  async findAll(userId: string, creditCardId?: string): Promise<CardInvoice[]> {
    const filter: any = { userId };
    if (creditCardId) {
      filter.creditCardId = creditCardId;
    }
    return this.cardInvoiceModel
      .find(filter)
      .sort({ year: -1, month: -1 })
      .populate('creditCardId')
      .exec();
  }

  async onModuleInit() {
    this.logger.log(
      'Disparando a rotina de gerenciamento de faturas na inicialização...',
    );
    await this.handleInvoiceManagement();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'invoice_management' })
  async handleInvoiceManagement() {
    this.logger.log('Iniciando rotina de gerenciamento de faturas...');
    const today = new Date();

    const openInvoices = await this.cardInvoiceModel
      .find({ status: 'OPEN' })
      .populate('creditCardId')
      .exec();

    for (const invoice of openInvoices) {
      const card = invoice.creditCardId as any as CreditCard;
      if (
        today.getFullYear() === invoice.year &&
        today.getMonth() === invoice.month &&
        today.getDate() >= card.closingDay
      ) {
        invoice.status = 'CLOSED';
        await invoice.save();
        this.logger.log(
          `Fatura do cartão ${card.name} de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(invoice.createdAt)} foi fechada.`,
        );
      }
    }

    const allCards = await this.creditCardModel.find().exec();

    for (const card of allCards) {
      const currentInvoiceYear =
        today.getDate() > card.closingDay
          ? today.getMonth() === 11
            ? today.getFullYear() + 1
            : today.getFullYear()
          : today.getFullYear();
      const currentInvoiceMonth =
        today.getDate() > card.closingDay
          ? (today.getMonth() + 1) % 12
          : today.getMonth();

      const existingInvoice = await this.cardInvoiceModel.findOne({
        creditCardId: card._id,
        month: currentInvoiceMonth,
        year: currentInvoiceYear,
      });

      if (!existingInvoice) {
        const newInvoice = new this.cardInvoiceModel({
          month: currentInvoiceMonth,
          year: currentInvoiceYear,
          creditCardId: card._id,
          userId: card.userId,
        });

        const savedInvoice = await newInvoice.save();
        this.logger.log(
          `Nova fatura de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(savedInvoice.createdAt)} para o cartão ${card.name} criada.`,
        );
      }
    }
    this.logger.log('Rotina de gerenciamento de faturas finalizada.');
  }
}
