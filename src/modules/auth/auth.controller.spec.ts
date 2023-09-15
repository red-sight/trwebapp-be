import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configIndex from '../../config';
import { v4 as uuid } from 'uuid';
import { UserService } from '@modules/user/user.service';
import { WebAppInitData } from './interfaces/WebAppInitData.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUserService;
  const auth_date = new Date().getTime();

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        AuthService,
        { provide: UserService, useValue: mockUserService },
      ],
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configIndex] })],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('auth', async () => {
    const initData: Partial<WebAppInitData> = {
      user: {
        id: 5606694108,
        username: 'Rosalia87',
        last_name: 'Wisoky',
        first_name: 'Wade',
        language_code: 'EN',
      },
      auth_date,
    };

    const createResult = {
      id: uuid(),
      tgId: initData.user.id,
      tgInintData: initData,
    };

    jest
      .spyOn(mockUserService, 'create')
      .mockImplementation(() => Promise.resolve(createResult));

    const webAppInitDataString =
      'auth_date=1689778707278&hash=3dbaf57025a68433b8cf03e25274bbe83d55ee0b533d17211255856d58fb7312&user=%7B%22id%22%3A5606694108%2C%22username%22%3A%22Rosalia87%22%2C%22last_name%22%3A%22Wisoky%22%2C%22first_name%22%3A%22Wade%22%2C%22language_code%22%3A%22EN%22%7D';

    const res = await controller.auth(
      { initData: webAppInitDataString },
      { userId: uuid() },
    );
    expect(res).toEqual(createResult);
  });
});
