import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { TransactionService } from '@modules/transaction/transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { DataSource } from 'typeorm';

describe('TransferService', () => {
  let service: TransferService;
  const transactionServiceMock = {};
  const transferRepositoryMock = {};
  const dataSourceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        {
          provide: TransactionService,
          useValue: transactionServiceMock,
        },
        {
          provide: getRepositoryToken(Transfer),
          useValue: transferRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
