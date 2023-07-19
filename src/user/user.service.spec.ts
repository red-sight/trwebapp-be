import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInterface } from './interfaces/CreateUser.interface';

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
    const data: CreateUserInterface = { tg_id: '1111222222' };
    saveMock.mockReturnValue(Promise.resolve(data));
    const user = await service.create(data);
    expect(user).toEqual(data);
  });
});
