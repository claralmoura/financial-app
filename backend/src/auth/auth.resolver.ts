import {
  Resolver,
  Mutation,
  Args,
  ObjectType,
  Field,
  Query,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { AuthPayload } from './dto/auth.payload';
import { LoginInput } from './dto/login.input';
import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ResetPasswordInput } from './dto/reset-password.input';

@ObjectType()
class ForgotPasswordResponse {
  @Field()
  message: string;
}

@ObjectType()
class ResetPasswordResponse {
  @Field()
  message: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => AuthPayload, { name: 'login' })
  async login(@Args('input') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.authService.login(user);
  }

  @Mutation(() => UserEntity, { name: 'register' })
  async register(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => UserEntity, { name: 'updateProfile' })
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: any,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(user.userId, updateUserInput);
  }

  @Query(() => UserEntity, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return this.usersService.findOneById(user.userId);
  }

  @Mutation(() => ForgotPasswordResponse, { name: 'forgotPassword' })
  async forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Mutation(() => ResetPasswordResponse, { name: 'resetPassword' })
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
