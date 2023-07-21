import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { WebAppInitData } from '../interfaces/WebAppInitData.interface';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  // async validate(email: string, password: string): Promise<any> {
  //   const userEmail = email.toLowerCase();
  //   const user = await this.authService.validateUser(userEmail, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }

  async validate(webAppInitDataString: string) {
    const user = await this.authService.validateWebAppInitData(
      webAppInitDataString,
    );
  }
}
