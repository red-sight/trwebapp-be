import { Module } from '@nestjs/common';
import { AccountController } from '@modules/account/account.controller';
import { AccountService } from '@modules/account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@modules/account/account.entity';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [AccountController],
  providers: [AccountService, TransactionService],
  exports: [TransactionService],
})
export class FinanceModule {}
