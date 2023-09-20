import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { ICreateAccount } from './interfaces/create.interface';
import {
  EAccountType,
  ECurrencyType,
  ESystemAccountType,
} from './types/account.types';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly i18n: I18nService,
  ) {}

  public findAccount(id: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ id });
  }

  public createAccount(createAccount: ICreateAccount): Account {
    if (createAccount.systemType && createAccount.type === EAccountType.USER) {
      throw new BadRequestException(
        this.i18n.t('errors.ACCOUNT_TYPES_MISMATCH'),
      );
    }
    return this.accountRepository.create(createAccount);
  }

  public async getSystemAccount(
    currency: ECurrencyType,
    systemType: ESystemAccountType,
  ): Promise<Account> {
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
