import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { WebAppInitData } from 'src/auth/interfaces/WebAppInitData.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(webAppInitData: Partial<WebAppInitData>): Promise<User> {
    return this.userRepository.save({
      tgId: webAppInitData.user.id,
      tgInitData: webAppInitData.user,
    });
  }
}
