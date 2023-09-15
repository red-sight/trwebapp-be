import { TransactionService } from '../transaction/transaction.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { WebAppInitData } from '@modules/auth/interfaces/WebAppInitData.interface';
import { Account } from '@modules/account/account.entity';
import { AccountService } from '@modules/account/account.service';
import {
  EAccountType,
  ECurrencyType,
} from '@modules/account/types/account.types';
import { FinanceService } from '@modules/finance/finance.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly financeService: FinanceService,
  ) {}

  async create(webAppInitData: Partial<WebAppInitData>): Promise<User> {
    let user = await this.userRepository.findOneBy({
      tgId: webAppInitData.user.id,
    });

    if (!user) {
      user = this.userRepository.create({
        tgId: webAppInitData.user.id,
        tgInitData: webAppInitData.user,
        accounts: [
          this.accountService.createAccount({
            type: EAccountType.USER,
            currency: ECurrencyType.REAL,
          }),
          this.accountService.createAccount({
            type: EAccountType.USER,
            currency: ECurrencyType.BONUS,
          }),
        ],
      });
      await this.userRepository.save(user);
      await this.financeService.deposit({
        user,
        amount: 30,
        currency: ECurrencyType.BONUS,
        desc: 'Welcome bonus',
      });
    }

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        accounts: true,
      },
    });
  }
}
