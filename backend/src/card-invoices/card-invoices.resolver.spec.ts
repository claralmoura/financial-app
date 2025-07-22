import { Test, TestingModule } from '@nestjs/testing';
import { CardInvoicesResolver } from './card-invoices.resolver';

describe('CardInvoicesResolver', () => {
  let resolver: CardInvoicesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardInvoicesResolver],
    }).compile();

    resolver = module.get<CardInvoicesResolver>(CardInvoicesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
