import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WebAppInitData } from '@modules/auth/interfaces/WebAppInitData.interface';
import { AccountService } from '@modules/account/account.service';
import { FinanceService } from '@modules/finance/finance.service';

describe('UserService', () => {
  let service: UserService;
  const accountServiceMock = {
    createAccount: jest.fn(),
  };
  const financeServiceMock = {
    deposit: jest.fn(),
  };
  const userRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: AccountService,
          useValue: accountServiceMock,
        },
        {
          provide: FinanceService,
          useValue: financeServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create a user', async () => {
    const data: Partial<WebAppInitData> = {
      auth_date: 1689778707278,
      user: {
        id: 5606694108,
        username: 'Rosalia87',
        last_name: 'Wisoky',
        first_name: 'Wade',
        language_code: 'EN',
      },
    };
    const findOne = jest
      .spyOn(userRepositoryMock, 'findOneBy')
      .mockImplementation(() => Promise.resolve(data.user));
    const user = await service.create(data);
  });
});
