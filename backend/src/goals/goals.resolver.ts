import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalEntity } from './entities/goal.entity';
import { CreateGoalInput } from './dto/create-goal.input';
import {
  UpdateGoalInput,
  AddToGoalInput,
  SubtractFromGoalInput,
} from './dto/update-goal.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => GoalEntity)
@UseGuards(JwtAuthGuard)
export class GoalsResolver {
  constructor(private readonly goalsService: GoalsService) {}

  @Mutation(() => GoalEntity, { name: 'createGoal' })
  createGoal(
    @CurrentUser() user: any,
    @Args('input') createGoalInput: CreateGoalInput,
  ) {
    return this.goalsService.create(user.userId, createGoalInput);
  }

  @Mutation(() => GoalEntity, { name: 'updateGoal' })
  updateGoal(
    @CurrentUser() user: any,
    @Args('input') updateGoalInput: UpdateGoalInput,
  ) {
    return this.goalsService.update(user.userId, updateGoalInput);
  }

  @Mutation(() => GoalEntity, { name: 'addToGoal' })
  addToGoal(
    @CurrentUser() user: any,
    @Args('input') addToGoalInput: AddToGoalInput,
  ) {
    return this.goalsService.addToGoal(user.userId, addToGoalInput);
  }

  @Mutation(() => GoalEntity, { name: 'removeGoal' })
  removeGoal(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.goalsService.remove(user.userId, id);
  }

  @Query(() => [GoalEntity], { name: 'goals' })
  findAll(@CurrentUser() user: any) {
    return this.goalsService.findAllByUserId(user.userId);
  }

  @Mutation(() => GoalEntity, { name: 'subtractFromGoal' })
  subtractFromGoal(
    @CurrentUser() user: any,
    @Args('input') subtractFromGoalInput: SubtractFromGoalInput,
  ) {
    return this.goalsService.subtractFromGoal(
      user.userId,
      subtractFromGoalInput,
    );
  }
}
