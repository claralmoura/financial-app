import { Test, TestingModule } from '@nestjs/testing';
import { FixedExpensesResolver } from './fixed-expenses.resolver';

describe('FixedExpensesResolver', () => {
  let resolver: FixedExpensesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FixedExpensesResolver],
    }).compile();

    resolver = module.get<FixedExpensesResolver>(FixedExpensesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
