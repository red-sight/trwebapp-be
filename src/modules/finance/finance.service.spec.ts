import { TestingModule, Test } from '@nestjs/testing';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { FinanceService } from './finance.service';
import { AccountService } from '@modules/account/account.service';
import { TransferService } from '@modules/transfer/transfer.service';
import { IDeposit } from './interfaces/deposit.interface';
import {
  EAccountType,
  ECurrencyType,
  ESystemAccountType,
} from '@modules/account/types/account.types';
import { randomUUID as uuid, randomInt } from 'crypto';
import { Account } from '@modules/account/account.entity';
import { Transfer } from '@modules/transfer/transfer.entity';

describe('FinanceService', () => {
  let service: FinanceService;
  const accountServiceMock = {
    getSystemAccount: jest.fn(),
  };
  const transferServiceMock = {
    createTransfer: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: join(__dirname, '../../i18n/'),
            watch: true,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
      providers: [
        FinanceService,
        {
          provide: AccountService,
          useValue: accountServiceMock,
        },
        {
          provide: TransferService,
          useValue: transferServiceMock,
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
  });

  describe('deposit', () => {
    it('deposit bonuses', async () => {
      const depositData: IDeposit = {
        user: {
          id: uuid(),
          tgId: randomInt(1000, 10000),
          tgInitData: {},
          accounts: [
            {
              id: uuid(),
              type: EAccountType.USER,
              systemType: null,
              currency: ECurrencyType.REAL,
              balance: 0,
              transactions: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: null,
            },
            {
              id: uuid(),
              type: EAccountType.USER,
              systemType: null,
              currency: ECurrencyType.REAL,
              balance: 30,
              transactions: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: null,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        amount: 20,
        currency: ECurrencyType.BONUS,
        desc: 'Deposit 20 bonuses to user',
      };

      const getSystemAccount = jest.spyOn(
        accountServiceMock,
        'getSystemAccount',
      );
      const createTransfer = jest.spyOn(transferServiceMock, 'createTransfer');

      const systemAccount = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.REAL,
        user: null,
        balance: 0,
        transactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      accountServiceMock.getSystemAccount.mockImplementation(
        (): Promise<Account> => Promise.resolve(systemAccount),
      );
      transferServiceMock.createTransfer.mockImplementation(
        (): Promise<Transfer> =>
          Promise.resolve({
            id: uuid(),
            desc: depositData.desc,
            transactions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
      );

      const deposit = await service.deposit(depositData);

      expect(deposit.id).toBeDefined();
      expect(deposit.desc).toEqual(depositData.desc);
      expect(deposit.transactions).toBeInstanceOf(Array);

      expect(getSystemAccount).toBeCalledTimes(1);
      expect(getSystemAccount).toBeCalledWith(
        depositData.currency,
        ESystemAccountType.DEPOSITS,
      );
      expect(createTransfer).toBeCalledTimes(1);
      expect(createTransfer).toBeCalledWith({
        amount: depositData.amount,
        desc: depositData.desc,
        from: systemAccount,
        to: depositData.user.accounts.find(
          (a) => a.currency === ECurrencyType.BONUS,
        ),
      });
    });

    it('deposit real', async () => {
      const depositData: IDeposit = {
        user: {
          id: uuid(),
          tgId: randomInt(1000, 10000),
          tgInitData: {},
          accounts: [
            {
              id: uuid(),
              type: EAccountType.USER,
              systemType: null,
              currency: ECurrencyType.BONUS,
              balance: 0,
              transactions: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: null,
            },
            {
              id: uuid(),
              type: EAccountType.USER,
              systemType: null,
              currency: ECurrencyType.REAL,
              balance: 30,
              transactions: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: null,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        amount: 20,
        currency: ECurrencyType.BONUS,
        desc: 'Deposit 20 bonuses to user',
      };

      const getSystemAccount = jest.spyOn(
        accountServiceMock,
        'getSystemAccount',
      );
      const createTransfer = jest.spyOn(transferServiceMock, 'createTransfer');

      const systemAccount = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.BONUS,
        user: null,
        balance: 0,
        transactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      accountServiceMock.getSystemAccount.mockImplementation(
        (): Promise<Account> => Promise.resolve(systemAccount),
      );
      transferServiceMock.createTransfer.mockImplementation(
        (): Promise<Transfer> =>
          Promise.resolve({
            id: uuid(),
            desc: depositData.desc,
            transactions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
      );

      const deposit = await service.deposit(depositData);

      expect(deposit.id).toBeDefined();
      expect(deposit.desc).toEqual(depositData.desc);
      expect(deposit.transactions).toBeInstanceOf(Array);

      expect(getSystemAccount).toBeCalledTimes(1);
      expect(getSystemAccount).toBeCalledWith(
        depositData.currency,
        ESystemAccountType.DEPOSITS,
      );
      expect(createTransfer).toBeCalledTimes(1);
      expect(createTransfer).toBeCalledWith({
        amount: depositData.amount,
        desc: depositData.desc,
        from: systemAccount,
        to: depositData.user.accounts.find(
          (a) => a.currency === ECurrencyType.BONUS,
        ),
      });
    });
  });
});
