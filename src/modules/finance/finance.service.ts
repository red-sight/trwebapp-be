import { TransferService } from './../transfer/transfer.service';
import { AccountService } from '@modules/account/account.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  // accountType,
  // accountTypeSystem,
} from '@modules/account/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from '@modules/transaction/transaction.entity';
import { Transfer } from '@modules/transfer/transfer.entity';
import { IDeposit } from './interfaces/deposit.interface';
import { ESystemAccountType } from '@modules/account/types/account.types';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,

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
      from: userAccount,
      to: systemDepositAccount,
      amount,
      desc,
    });

    return depositTransfer;
  }

  /* async deposit(account: Account, amount: number): Promise<Transaction> {
    const systemAccount: Account = await this.accountService.getSystemAccount(
      account.type,
      accountTypeSystem.DEPOSITS,
    );

    const transaction: Transaction = this.transactionRepository.create({
      amount,
      runningBalance: account.balance + amount,
      account,
    });
    systemAccount.balance -= amount;
    account.balance += amount;

    await this.transactionRepository.save(transaction);
    await this.accountRepository.save(account);
    await this.accountRepository.save(systemAccount);

    return transaction;
  } */
}
