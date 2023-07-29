import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WebAppInitData } from './interfaces/WebAppInitData.interface';
import { AuthDto } from './dtos/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  @UseFilters(new I18nValidationExceptionFilter())
  async auth(@Body() body: AuthDto, @Session() session: any) {
    const user = await this.authService.auth(body.initData);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Session() session: any) {
    return session.userId;
  }

  @Post('/generate')
  async generate(@Body() webAppInitData: WebAppInitData) {
    return this.authService.generateWebAppInitData(webAppInitData);
  }

  @Get('/testi18n')
  async localetest(@I18n() i18n: I18nContext) {
    return await i18n.t('common.message');
  }
}
