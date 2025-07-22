import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FixedExpense,
  FixedExpenseDocument,
} from './schemas/fixed-expense.schema';
import { CreateFixedExpenseInput } from './dto/create-fixed-expense.input';
import { UpdateFixedExpenseInput } from './dto/update-fixed-expense.input';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';

@Injectable()
export class FixedExpensesService {
  constructor(
    @InjectModel(FixedExpense.name)
    private fixedExpenseModel: Model<FixedExpenseDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(
    userId: string,
    createFixedExpenseInput: CreateFixedExpenseInput,
  ): Promise<FixedExpense> {
    const fixedExpenseData = { ...createFixedExpenseInput, userId };
    const createdFixedExpense = new this.fixedExpenseModel(fixedExpenseData);
    return createdFixedExpense.save();
  }

  async findAllByUserId(userId: string): Promise<any[]> {
    const fixedExpenses = await this.fixedExpenseModel
      .find({ userId })
      .lean()
      .exec();

    if (!fixedExpenses?.length) return [];

    const categoryIds = [
      ...new Set(
        fixedExpenses.map((t) => t.categoryId?.toString()).filter(Boolean),
      ),
    ];

    if (!categoryIds?.length) {
      return fixedExpenses.map((t) => ({ ...t, category: null }));
    }

    const categories = await this.categoryModel
      .find({ _id: { $in: categoryIds } })
      .lean()
      .exec();

    const categoryMap = new Map(categories.map((c) => [c._id.toString(), c]));

    return fixedExpenses.map((t) => ({
      ...t,
      category: t.categoryId ? categoryMap.get(t.categoryId.toString()) : null,
    }));
  }

  async update(
    userId: string,
    updateFixedExpenseInput: UpdateFixedExpenseInput,
  ): Promise<FixedExpense> {
    const { id, ...updateData } = updateFixedExpenseInput;
    const fixedExpense = await this.fixedExpenseModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();

    if (!fixedExpense) {
      throw new NotFoundException(`Gasto Fixo não encontrado.`);
    }
    return fixedExpense;
  }

  async remove(userId: string, id: string): Promise<FixedExpense> {
    const fixedExpense = await this.fixedExpenseModel
      .findOneAndDelete({ _id: id, userId })
      .exec();

    if (!fixedExpense) {
      throw new NotFoundException(`Gasto Fixo não encontrado.`);
    }
    return fixedExpense;
  }
}
