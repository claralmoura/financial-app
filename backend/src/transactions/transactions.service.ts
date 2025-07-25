import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Parser } from 'json2csv';
import {
  FixedExpense,
  FixedExpenseDocument,
} from 'src/fixed-expenses/schemas/fixed-expense.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { CreateTransactionInput } from './dto/create-transaction.input';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';
import {
  CardInvoice,
  CardInvoiceDocument,
} from 'src/card-invoices/schemas/card-invoice.schema';
import {
  CreditCard,
  CreditCardDocument,
} from 'src/credit-cards/schemas/credit-card.schema';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(FixedExpense.name)
    private fixedExpenseModel: Model<FixedExpenseDocument>,
    @InjectModel(CardInvoice.name)
    private cardInvoiceModel: Model<CardInvoiceDocument>,
    @InjectModel(CreditCard.name)
    private creditCardModel: Model<CreditCardDocument>,
  ) {}

  private async _populateTransactions(transactions: any[]): Promise<any[]> {
    if (!transactions || transactions.length === 0) return [];

    const categoryIds = [
      ...new Set(
        transactions.map((t) => t.categoryId?.toString()).filter(Boolean),
      ),
    ];
    const cardInvoiceIds = [
      ...new Set(
        transactions.map((t) => t.cardInvoiceId?.toString()).filter(Boolean),
      ),
    ];

    const categories = await this.categoryModel
      .find({ _id: { $in: categoryIds } })
      .lean()
      .exec();
    const invoices = await this.cardInvoiceModel
      .find({ _id: { $in: cardInvoiceIds } })
      .lean()
      .exec();

    const creditCardIds = [
      ...new Set(
        invoices.map((i) => i.creditCardId?.toString()).filter(Boolean),
      ),
    ];
    const creditCards = await this.creditCardModel
      .find({ _id: { $in: creditCardIds } })
      .lean()
      .exec();

    const categoryMap = new Map(categories.map((c) => [c._id.toString(), c]));
    const creditCardMap = new Map(
      creditCards.map((c) => [c._id.toString(), c]),
    );
    const invoiceMap = new Map(
      invoices.map((i) => {
        const card = i.creditCardId
          ? creditCardMap.get(i.creditCardId.toString())
          : null;
        return [i._id.toString(), { ...i, creditCard: card }];
      }),
    );

    return transactions.map((t) => ({
      ...t,
      category: t.categoryId ? categoryMap.get(t.categoryId.toString()) : null,
      cardInvoice: t.cardInvoiceId
        ? invoiceMap.get(t.cardInvoiceId.toString())
        : null,
    }));
  }

  async findAll(userId: string): Promise<any[]> {
    const transactions = await this.transactionModel
      .find({ userId })
      .lean()
      .exec();
    return this._populateTransactions(transactions);
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
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException(
        'Transação não encontrada ou você não tem permissão.',
      );
    }
    return transaction;
  }

  async remove(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!transaction) {
      throw new NotFoundException(
        'Transação não encontrada ou você não tem permissão.',
      );
    }
    return transaction;
  }

  async exportToCsv(userId: string): Promise<string> {
    const rawTransactions = await this.transactionModel
      .find({ userId })
      .lean()
      .exec();
    const transactions = await this._populateTransactions(rawTransactions);

    if (!transactions?.length) {
      return '';
    }

    const formattedData = transactions.map((t) => ({
      Data: new Date(Number(t.date)).toLocaleDateString('pt-BR'),
      Descricao: t.description,
      Valor: t.value,
      Tipo:
        t.type === 'income'
          ? 'Receita'
          : t.type === 'expense'
            ? 'Despesa'
            : 'Cartão de Crédito',
      Categoria: t.category?.name || 'N/A',
      Fonte:
        t.type === 'card_expense'
          ? t.cardInvoice?.creditCard?.name || 'Cartão'
          : 'N/A',
    }));

    const fields = ['Data', 'Descricao', 'Valor', 'Tipo', 'Categoria', 'Fonte'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedData);

    return csv;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: 'generate_monthly_transactions',
    timeZone: 'America/Fortaleza',
  })
  async generateMonthlyTransactions() {
    this.logger.log(
      'Iniciando rotina para gerar transações de gastos fixos...',
    );

    const activeFixedExpenses = await this.fixedExpenseModel
      .find({ isActive: true })
      .exec();
    if (!activeFixedExpenses?.length) {
      this.logger.log('Nenhum gasto fixo ativo encontrado. Rotina finalizada.');
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let createdCount = 0;

    for (const expense of activeFixedExpenses) {
      const dueDate = new Date(currentYear, currentMonth, expense.dueDate);
      const existingTransaction = await this.transactionModel.findOne({
        userId: expense.userId,
        description: expense.description,
        value: expense.value,
        $expr: {
          $and: [
            { $eq: [{ $month: '$date' }, currentMonth + 1] },
            { $eq: [{ $year: '$date' }, currentYear] },
          ],
        },
      });

      if (!existingTransaction) {
        const newTransaction = new this.transactionModel({
          description: expense.description,
          value: expense.value,
          type: 'expense',
          date: dueDate,
          categoryId: expense.categoryId,
          userId: expense.userId,
        });
        await newTransaction.save();
        createdCount++;
      }
    }
    this.logger.log(
      `${createdCount} novas transações de gastos fixos foram geradas.`,
    );
  }
}
