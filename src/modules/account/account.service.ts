import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { ICreateAccount } from './interfaces/create.interface';
import {
  EAccountType,
  ECurrencyType,
  ESystemAccountType,
} from './types/account.types';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  public findAccount(id: string): Promise<Account> {
    return this.accountRepository.findOneBy({ id });
  }

  public createAccount(createAccount: ICreateAccount): Account {
    return this.accountRepository.create(createAccount);
  }

  public async getSystemAccount(
    currency: ECurrencyType,
    systemType: ESystemAccountType,
  ) {
    let account = await this.accountRepository.findOneBy({
      type: EAccountType.SYSTEM,
      systemType,
      currency,
    });
    if (!account) {
      account = await this.accountRepository.create({
        type: EAccountType.SYSTEM,
        systemType,
        currency,
      });
      await this.accountRepository.save(account);
    }
    return account;
  }
}
