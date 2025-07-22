import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(createUserInput);
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOneBy(
    filter: FilterQuery<UserDocument>,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne(filter).exec();
  }

  async update(
    userId: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserInput.email,
      });
      if (existingUser) {
        throw new ConflictException('Este email já está em uso.');
      }
      user.email = updateUserInput.email;
    }

    if (updateUserInput.name) {
      user.name = updateUserInput.name;
    }

    if (updateUserInput.notificationsEnabled !== undefined) {
      user.notificationsEnabled = updateUserInput.notificationsEnabled;
    }

    if (updateUserInput.password) {
      user.password = updateUserInput.password;
    }

    return user.save();
  }
}
