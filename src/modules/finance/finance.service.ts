import { TransferService } from './../transfer/transfer.service';
import { AccountService } from '@modules/account/account.service';
import { Injectable } from '@nestjs/common';
import { IDeposit } from './interfaces/deposit.interface';
import { ESystemAccountType } from '@modules/account/types/account.types';

@Injectable()
export class FinanceService {
  constructor(
    private readonly accountService: AccountService,
    private readonly transferService: TransferService,
  ) {}

  public async deposit(data: IDeposit) {
    const { user, amount, currency, desc = 'deposit' } = data;

    const userAccount = user.accounts.find((a) => a.currency === currency);

    const systemDepositAccount = await this.accountService.getSystemAccount(
      currency,
      ESystemAccountType.DEPOSITS,
    );

    const depositTransfer = await this.transferService.createTransfer({
      to: userAccount,
      from: systemDepositAccount,
      amount,
      desc,
    });

    return depositTransfer;
  }
}
