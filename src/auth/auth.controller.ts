import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WebAppInitData } from './interfaces/WebAppInitData.interface';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  async auth(@Body() body: AuthDto) {
    return this.authService.auth(body.initData);
  }

  @Post('/generate')
  async generate(@Body() webAppInitData: WebAppInitData) {
    return this.authService.generateWebAppInitData(webAppInitData);
  }
}
