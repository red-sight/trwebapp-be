import { AccountService } from '../account/account.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../account/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    private readonly accountService: AccountService,
  ) {}

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
