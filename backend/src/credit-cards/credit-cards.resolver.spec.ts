import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsResolver } from './credit-cards.resolver';

describe('CreditCardsResolver', () => {
  let resolver: CreditCardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditCardsResolver],
    }).compile();

    resolver = module.get<CreditCardsResolver>(CreditCardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
