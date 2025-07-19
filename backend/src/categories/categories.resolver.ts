import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => CategoryEntity)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CategoryEntity, { name: 'createCategory' })
  createCategory(
    @CurrentUser() user: any,
    @Args('input') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(user.userId, createCategoryInput);
  }

  @Mutation(() => CategoryEntity, { name: 'updateCategory' })
  updateCategory(
    @CurrentUser() user: any,
    @Args('input') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(user.userId, updateCategoryInput);
  }

  @Mutation(() => CategoryEntity, { name: 'removeCategory' })
  removeCategory(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.categoriesService.remove(user.userId, id);
  }

  @Query(() => [CategoryEntity], { name: 'categories' })
  findAll(@CurrentUser() user: any) {
    return this.categoriesService.findAllByUserId(user.userId);
  }
}
