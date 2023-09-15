import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './financial.service';
import {
  Account,
  accountType,
  accountTypeSystem,
} from '../account/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { AccountService } from '../account/account.service';
import { v4 as uuid } from 'uuid';

describe('TransactionService', () => {
  let service: TransactionService;
  const accounts = [];
  const accountRepositoryMock = {
    create: (newAccount): Account => {
      const account: Account = {
        id: uuid(),
        type: newAccount.type || accountType.REAL,
        balance: 0,
        typeSystem: newAccount.typeSystem || null,
        user: null,
        transactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      accounts.push(account);
      return account;
    },
    save: async (account: Account): Promise<Account> =>
      Promise.resolve(account),
  };

  const transactionRepositoryMock = {
    create: (newTransaction): Transaction => {
      const transaction: Transaction = {
        id: uuid(),
        amount: newTransaction.amount,
        runningBalance:
          parseInt(newTransaction.account.balance) +
          parseInt(newTransaction.amount),
        account: newTransaction.account,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      transaction.account.transactions.push(transaction);
      return transaction;
    },
    save: async (transaction: Transaction): Promise<Transaction> =>
      Promise.resolve(transaction),
  };

  const accountServiceMock = {
    getSystemAccount: async (
      type: accountType,
      typeSystem: accountTypeSystem,
    ): Promise<Account> => {
      let account = accounts.find(
        (a) => a.type === type && a.typeSystem === typeSystem,
      );
      if (!account)
        account = await accountRepositoryMock.create({
          type,
          typeSystem,
        });
      return Promise.resolve(account);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: AccountService,
          useValue: accountServiceMock,
        },
        {
          provide: getRepositoryToken(Account),
          useValue: accountRepositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deposit', async () => {
    const userAccount: Account = accountRepositoryMock.create({
      type: accountType.BONUS,
    });

    const res = await service.deposit(userAccount, 30);

    console.dir(res, { depth: null });
  });
});
