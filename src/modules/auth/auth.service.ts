import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebAppInitData } from './interfaces/WebAppInitData.interface';
import * as crypto from 'node:crypto';
import { UserService } from '@modules/user/user.service';
import { User } from '@modules/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  auth(webAppInitDataString: string): Promise<User> {
    const webAppInitData: Partial<WebAppInitData> =
      this.validateWebAppInitData(webAppInitDataString);
    if (!webAppInitData) throw new UnauthorizedException();

    const user = this.userService.create(webAppInitData);
    return user;
  }

  generateWebAppInitData(initData: Partial<WebAppInitData>): string {
    const searchParams = new URLSearchParams();
    const dataCheckArr = [];

    for (const key of Object.keys(initData)) {
      const rawValue = initData[key];
      const value: string =
        typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);
      searchParams.append(key, value);
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();

    const dataCheckString = dataCheckArr.join('/n');
    const hash = this.generateHash(dataCheckString);
    searchParams.append('hash', hash);
    searchParams.sort();

    return searchParams.toString();
  }

  validateWebAppInitData(initDataString: string): Partial<WebAppInitData> {
    const searchParams = new URLSearchParams(initDataString);
    const hash = searchParams.get('hash');
    const dataCheckArr: string[] = [];
    const webAppInitData: Partial<WebAppInitData> = {};
    searchParams.sort();
    searchParams.forEach((val, key) => {
      if (key !== 'hash') {
        dataCheckArr.push(`${key}=${val}`);
        webAppInitData[key] = ['can_send_after', 'auth_date'].includes(key)
          ? parseInt(val)
          : (webAppInitData[key] = ['user', 'receiver', 'chat'].includes(key)
              ? JSON.parse(val)
              : val);
      }
    });
    const dataCheckString = dataCheckArr.join('/n');
    const validHash = this.generateHash(dataCheckString);

    return hash === validHash && webAppInitData;
  }

  private generateHash(dataCheckString): string {
    const telegramBotToken = this.configService.get<string>('telegramBotToken');
    // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(telegramBotToken);
    // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
    const hash = crypto
      .createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');
    return hash;
  }
}
