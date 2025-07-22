import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditCard, CreditCardDocument } from './schemas/credit-card.schema';
import { CreateCreditCardInput } from './dto/create-credit-card.input';
import { UpdateCreditCardInput } from './dto/update-credit-card.input';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectModel(CreditCard.name)
    private creditCardModel: Model<CreditCardDocument>,
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

  async update(
    userId: string,
    updateCreditCardInput: UpdateCreditCardInput,
  ): Promise<CreditCard> {
    const { id, ...updateData } = updateCreditCardInput;
    const card = await this.creditCardModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();

    if (!card) {
      throw new NotFoundException(
        `Cartão com ID "${id}" não encontrado ou você não tem permissão para editá-lo.`,
      );
    }
    return card;
  }

  async remove(userId: string, id: string): Promise<CreditCard> {
    const card = await this.creditCardModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();

    if (!card) {
      throw new NotFoundException(
        `Cartão com ID "${id}" não encontrado ou você não tem permissão para removê-lo.`,
      );
    }
    return card;
  }

  async findOneById(id: string): Promise<CreditCard> {
    return this.creditCardModel.findById(id).exec();
  }
}
