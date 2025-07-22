import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardEntity } from './entities/credit-card.entity';
import { CreateCreditCardInput } from './dto/create-credit-card.input';
import { UpdateCreditCardInput } from './dto/update-credit-card.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => CreditCardEntity)
@UseGuards(JwtAuthGuard)
export class CreditCardsResolver {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Mutation(() => CreditCardEntity, { name: 'createCreditCard' })
  createCreditCard(
    @CurrentUser() user: any,
    @Args('input') createCreditCardInput: CreateCreditCardInput,
  ) {
    return this.creditCardsService.create(user.userId, createCreditCardInput);
  }

  @Query(() => CreditCardEntity, { name: 'creditCard' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.creditCardsService.findOneById(id);
  }

  @Query(() => [CreditCardEntity], { name: 'creditCards' })
  findAll(@CurrentUser() user: any) {
    return this.creditCardsService.findAllByUserId(user.userId);
  }

  @Mutation(() => CreditCardEntity, { name: 'updateCreditCard' })
  updateCreditCard(
    @CurrentUser() user: any,
    @Args('input') updateCreditCardInput: UpdateCreditCardInput,
  ) {
    return this.creditCardsService.update(user.userId, updateCreditCardInput);
  }

  @Mutation(() => CreditCardEntity, { name: 'removeCreditCard' })
  removeCreditCard(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.creditCardsService.remove(user.userId, id);
  }
}
