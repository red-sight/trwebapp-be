import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { randomUUID as uuid } from 'crypto';

describe('AccountService', () => {
  let service: AccountService;
  const accountRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      const res = await service.findAccount(id);
      console.log('res', res);
      expect(findOneBy).toHaveBeenCalledTimes(1);
      expect(findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  /* describe('createAccount', () => {
    it('createAccount', async () => {
      const create = jest.spyOn(accountRepositoryMock, 'create');
      const data;
    });
  }); */
});
