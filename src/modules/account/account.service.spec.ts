import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { randomUUID as uuid } from 'crypto';
import { ICreateAccount } from './interfaces/create.interface';
import {
  EAccountType,
  ECurrencyType,
  ESystemAccountType,
} from './types/account.types';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { BadRequestException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  const accountRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
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
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: accountRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAccount', () => {
    it('findAccount', async () => {
      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const id = uuid();
      await service.findAccount(id);
      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('createAccount', () => {
    it('create user account of bonus type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.BONUS,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('create user account of real type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.REAL,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('create system deposit account of real type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.REAL,
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('create system deposit account of bonus type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.BONUS,
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('create system fees account of real type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.REAL,
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('create system fees account of bonus type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        currency: ECurrencyType.BONUS,
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
      };
      service.createAccount(createAccountData);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createAccountData);
    });

    it('error on creating a user account of system type', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const createAccountData: ICreateAccount = {
        type: EAccountType.USER,
        currency: ECurrencyType.REAL,
        systemType: ESystemAccountType.FEES,
      };
      expect(() => service.createAccount(createAccountData)).toThrow(
        new BadRequestException(
          'System account type should not be assigned to user account',
        ),
      );
      expect(create).not.toHaveBeenCalled();
    });
  });

  describe('getSystemAccount', () => {
    it('get existing system deposit bonus account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.BONUS,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get existing system deposit real account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.REAL,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get existing system fees bonus account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
        currency: ECurrencyType.BONUS,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get existing system fees real account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
        currency: ECurrencyType.REAL,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get created unexistent system deposit bonus account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.BONUS,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(null),
      );
      accountRepositoryMock.create.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );
      accountRepositoryMock.save.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith(foundAccount);
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get created unexistent system deposit real account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.DEPOSITS,
        currency: ECurrencyType.REAL,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(null),
      );
      accountRepositoryMock.create.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );
      accountRepositoryMock.save.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith(foundAccount);
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get created unexistent system fees bonus account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
        currency: ECurrencyType.BONUS,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(null),
      );
      accountRepositoryMock.create.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );
      accountRepositoryMock.save.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith(foundAccount);
      expect(getSystemAccount).toEqual(foundAccount);
    });

    it('get created unexistent system fees real account', async () => {
      const foundAccount: Account = {
        id: uuid(),
        type: EAccountType.SYSTEM,
        systemType: ESystemAccountType.FEES,
        currency: ECurrencyType.REAL,
        balance: 100,
        user: null,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        transactions: [],
      };

      accountRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(null),
      );
      accountRepositoryMock.create.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );
      accountRepositoryMock.save.mockImplementation(() =>
        Promise.resolve(foundAccount),
      );

      const findOneBy = jest.spyOn(accountRepositoryMock, 'findOneBy');
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const save = jest.spyOn(accountRepositoryMock, 'save');

      const getSystemAccount = await service.getSystemAccount(
        foundAccount.currency,
        foundAccount.systemType,
      );

      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        type: foundAccount.type,
        systemType: foundAccount.systemType,
        currency: foundAccount.currency,
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith(foundAccount);
      expect(getSystemAccount).toEqual(foundAccount);
    });
  });
});
