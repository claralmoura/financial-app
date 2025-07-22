import { Test, TestingModule } from '@nestjs/testing';
import { CardInvoicesService } from './card-invoices.service';

describe('CardInvoicesService', () => {
  let service: CardInvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardInvoicesService],
    }).compile();

    service = module.get<CardInvoicesService>(CardInvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
