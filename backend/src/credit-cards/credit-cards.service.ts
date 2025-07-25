import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditCard, CreditCardDocument } from './schemas/credit-card.schema';
import { CreateCreditCardInput } from './dto/create-credit-card.input';
import { UpdateCreditCardInput } from './dto/update-credit-card.input';
import {
  CardInvoice,
  CardInvoiceDocument,
} from 'src/card-invoices/schemas/card-invoice.schema';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectModel(CreditCard.name)
    private creditCardModel: Model<CreditCardDocument>,
    @InjectModel(CardInvoice.name)
    private cardInvoiceModel: Model<CardInvoiceDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    userId: string,
    createCreditCardInput: CreateCreditCardInput,
  ): Promise<CreditCard> {
    const cardData = { ...createCreditCardInput, userId };
    const createdCard = new this.creditCardModel(cardData);
    return createdCard.save();
  }

  async findAllByUserId(userId: string): Promise<CreditCard[]> {
    return this.creditCardModel.find({ userId }).exec();
  }

  async findOneById(id: string): Promise<CreditCard> {
    return this.creditCardModel.findById(id).exec();
  }

  async update(
    userId: string,
    updateCreditCardInput: UpdateCreditCardInput,
  ): Promise<CreditCard> {
    const { id, ...updateData } = updateCreditCardInput;
    const card = await this.creditCardModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();

    if (!card) {
      throw new NotFoundException(`Cartão com ID "${id}" não encontrado.`);
    }
    return card;
  }

  async remove(userId: string, id: string): Promise<CreditCard> {
    const cardToDelete = await this.creditCardModel.findOne({
      _id: id,
      userId,
    });
    if (!cardToDelete) {
      throw new NotFoundException(`Cartão com ID "${id}" não encontrado.`);
    }

    const invoices = await this.cardInvoiceModel.find({
      creditCardId: id,
      userId,
    });
    if (invoices.length > 0) {
      const invoiceIds = invoices.map((invoice) => invoice._id);
      await this.transactionModel.deleteMany({
        cardInvoiceId: { $in: invoiceIds },
      });
      await this.cardInvoiceModel.deleteMany({ _id: { $in: invoiceIds } });
    }

    await this.creditCardModel.findByIdAndDelete(id);
    return cardToDelete;
  }
}
