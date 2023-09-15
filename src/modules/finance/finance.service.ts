import { AccountService } from '@modules/account/account.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  // accountType,
  // accountTypeSystem,
} from '@modules/account/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Transfer } from '../transfer/transfer.entity';

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
  ) {}

  /* private async transfer(
    from: string,
    to: string,
    amount: number,
    desc: string,
  ) {
    const accountFrom: Account = await this.accountService.findAccount(from);
    if (!accountFrom) throw new NotFoundException(`Account ${from} not found`);
    if (!accountFrom.typeSystem && accountFrom.balance < amount)
      throw new ForbiddenException(`Not enough funds on account ${to}`);

    const accountTo: Account = await this.accountService.findAccount(to);
    if (!accountTo) throw new NotFoundException(`Account ${to} not found`);

    const transfer = await this.transferRepository.create({
      amount,
      transactions: [{
        amount: 
      }],
    });
  } */

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
