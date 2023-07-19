import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/auth')
  async auth() {
    return true;
  }
}
