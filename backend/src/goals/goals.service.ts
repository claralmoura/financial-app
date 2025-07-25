import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goal, GoalDocument } from './schemas/goal.schema';
import { CreateGoalInput } from './dto/create-goal.input';
import {
  UpdateGoalInput,
  AddToGoalInput,
  SubtractFromGoalInput,
} from './dto/update-goal.input';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name)
    private goalModel: Model<GoalDocument>,
  ) {}

  async create(
    userId: string,
    createGoalInput: CreateGoalInput,
  ): Promise<Goal> {
    const goalData = {
      ...createGoalInput,
      userId,
      currentValue: 0,
    };
    const createdGoal = new this.goalModel(goalData);
    return createdGoal.save();
  }

  async findAllByUserId(userId: string): Promise<Goal[]> {
    return this.goalModel.find({ userId }).exec();
  }

  async update(
    userId: string,
    updateGoalInput: UpdateGoalInput,
  ): Promise<Goal> {
    const { id, ...updateData } = updateGoalInput;
    const goal = await this.goalModel
      .findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
      .exec();

    if (!goal) {
      throw new NotFoundException(
        `Meta com ID "${id}" não encontrada ou você não tem permissão para editá-la.`,
      );
    }
    return goal;
  }

  async addToGoal(
    userId: string,
    addToGoalInput: AddToGoalInput,
  ): Promise<Goal> {
    const { id, value } = addToGoalInput;
    const goal = await this.goalModel
      .findOneAndUpdate(
        { _id: id, userId },
        { $inc: { currentValue: value } },
        { new: true },
      )
      .exec();

    if (!goal) {
      throw new NotFoundException(
        `Meta com ID "${id}" não encontrada ou você não tem permissão para adicionar valor.`,
      );
    }
    return goal;
  }

  async remove(userId: string, id: string): Promise<Goal> {
    const goal = await this.goalModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();

    if (!goal) {
      throw new NotFoundException(
        `Meta com ID "${id}" não encontrada ou você não tem permissão para removê-la.`,
      );
    }
    return goal;
  }

  async subtractFromGoal(
    userId: string,
    subtractFromGoalInput: SubtractFromGoalInput,
  ): Promise<Goal> {
    const { id, value } = subtractFromGoalInput;

    const goal = await this.goalModel.findOne({ _id: id, userId });

    if (!goal) {
      throw new NotFoundException(`Meta com ID "${id}" não encontrada.`);
    }

    if (goal.currentValue < value) {
      throw new BadRequestException(
        'O valor a ser removido não pode ser maior que o valor atual da meta.',
      );
    }

    goal.currentValue -= value;
    return goal.save();
  }
}
