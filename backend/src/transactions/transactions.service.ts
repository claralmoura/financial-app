import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { CreateTransactionInput } from './dto/create-transaction.input';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Busca todas as transações de um usuário e popula manualmente as categorias.
   */
  async findAll(userId: string): Promise<any[]> {
    const transactions = await this.transactionModel
      .find({ userId })
      .lean()
      .exec();

    const categoryIds = [
      ...new Set(
        transactions.map((t) => t.categoryId?.toString()).filter(Boolean),
      ),
    ];

    if (categoryIds.length === 0) {
      return transactions.map((t) => ({ ...t, category: null }));
    }
    const categories = await this.categoryModel
      .find({ _id: { $in: categoryIds } })
      .lean()
      .exec();

    const categoryMap = new Map(categories.map((c) => [c._id.toString(), c]));
    const populatedTransactions = transactions.map((t) => ({
      ...t,
      category: t.categoryId ? categoryMap.get(t.categoryId.toString()) : null,
    }));

    return populatedTransactions;
  }

  async create(
    userId: string,
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const transactionData = { ...createTransactionInput, userId };
    const createdTransaction = new this.transactionModel(transactionData);
    return createdTransaction.save();
  }

  async update(
    userId: string,
    updateTransactionInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    const { id, ...updateData } = updateTransactionInput;
    const transaction = await this.transactionModel
      .findOneAndUpdate({ _id: id, userId: userId }, updateData, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException(
        `Transação não encontrada ou você não tem permissão.`,
      );
    }
    return transaction;
  }

  async remove(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOneAndDelete({
        _id: id,
        userId: userId,
      })
      .exec();
    if (!transaction) {
      throw new NotFoundException(
        `Transação não encontrada ou você não tem permissão.`,
      );
    }
    return transaction;
  }
}
