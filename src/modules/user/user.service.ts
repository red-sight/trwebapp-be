import { TransactionService } from '../transaction/transaction.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { WebAppInitData } from '@modules/auth/interfaces/WebAppInitData.interface';
import { Account } from '@modules/account/account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly transactionService: TransactionService,
  ) {}

  async create(webAppInitData: Partial<WebAppInitData>): Promise<User> {
    let user = await this.userRepository.findOneBy({
      tgId: webAppInitData.user.id,
    });

    if (!user) {
      user = this.userRepository.create({
        tgId: webAppInitData.user.id,
        tgInitData: webAppInitData.user,
        /* accounts: [
          this.accountRepository.create({
            type: accountType.BONUS,
          }),
          this.accountRepository.create({
            type: accountType.REAL,
          }),
        ], */
      });
      await this.userRepository.save(user);

      /* await this.transactionService.deposit(
        user.accounts.find((a) => a.type === accountType.BONUS),
        30,
      ); */
    }

    return user;
  }
}
