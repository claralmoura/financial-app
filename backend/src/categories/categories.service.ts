import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Cria uma nova categoria para um usuário específico.
   */
  async create(
    userId: string,
    createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const categoryData = {
      ...createCategoryInput,
      userId,
    };
    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  /**
   * Busca todas as categorias de um usuário específico.
   */
  async findAllByUserId(userId: string): Promise<Category[]> {
    return this.categoryModel.find({ userId }).exec();
  }

  /**
   * Atualiza uma categoria de um usuário específico.
   */
  async update(
    userId: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const { id, ...updateData } = updateCategoryInput;

    const category = await this.categoryModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException(
        `Categoria com ID "${id}" não encontrada ou você não tem permissão para editá-la.`,
      );
    }
    return category;
  }

  /**
   * Remove uma categoria de um usuário específico.
   */
  async remove(userId: string, id: string): Promise<Category> {
    const category = await this.categoryModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();

    if (!category) {
      throw new NotFoundException(
        `Categoria com ID "${id}" não encontrada ou você não tem permissão para removê-la.`,
      );
    }
    return category;
  }
}
