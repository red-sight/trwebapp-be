import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebAppInitData } from './interfaces/WebAppInitData.interface';
import configIndex from '../config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  // let config;
  const auth_date = new Date().getTime();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService],
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configIndex] })],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('valid auth', async () => {
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

    const initDataString: string = service.generateWebAppInitData(initData);
    const user: User = await service.auth(initDataString);
    console.log(user);
  });

  it('invalid auth', () => {
    const initDataString =
      'auth_date=1689778707278&hash=1dbaf57025a68433b8cf03e25274bbe83d55ee0b533d17211255856d58fb7312&user=%7B%22id%22%3A5606694108%2C%22username%22%3A%22Rosalia87%22%2C%22last_name%22%3A%22Wisoky%22%2C%22first_name%22%3A%22Wade%22%2C%22language_code%22%3A%22EN%22%7D';

    let error;
    try {
      service.auth(initDataString);
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new UnauthorizedException());
  });
});
