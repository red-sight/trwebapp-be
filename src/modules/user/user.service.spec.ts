import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WebAppInitData } from 'src/modules/auth/interfaces/WebAppInitData.interface';

describe('UserService', () => {
  let service: UserService;
  let saveMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: saveMock,
            findOneBy: jest.fn(),
          },
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
    saveMock.mockReturnValue(Promise.resolve(data));
    const user = await service.create(data);
    expect(user).toEqual(data);
  });
});
