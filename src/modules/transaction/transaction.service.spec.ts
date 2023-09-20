import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { ICreateTransaction } from './interfaces/createTransaction.interface';
import { randomUUID as uuid } from 'crypto';
import {
  EAccountType,
  ECurrencyType,
} from '@modules/account/types/account.types';

describe('TransactionService', () => {
  let service: TransactionService;
  const transactionRepositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('create', async () => {
      const create = jest.spyOn(transactionRepositoryMock, 'create');
      const createTransaction: ICreateTransaction = {
        account: {
          id: uuid(),
          type: EAccountType.USER,
          systemType: null,
          currency: ECurrencyType.REAL,
          balance: 10,
          user: null,
          transactions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        amount: 10,
        desc: 'Desc',
        runningBalance: 20,
      };
      await service.create(createTransaction);
      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(createTransaction);
    });
  });
});
