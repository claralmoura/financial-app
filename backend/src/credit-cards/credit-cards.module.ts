import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsResolver } from './credit-cards.resolver';
import { CreditCard, CreditCardSchema } from './schemas/credit-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditCard.name, schema: CreditCardSchema },
    ]),
  ],
  providers: [CreditCardsResolver, CreditCardsService],
})
export class CreditCardsModule {}
