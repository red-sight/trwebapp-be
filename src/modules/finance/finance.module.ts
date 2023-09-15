import { Module } from '@nestjs/common';
import { AccountService } from '@modules/account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@modules/account/account.entity';
import { TransactionService } from '@modules/transaction/transaction.service';
import { Transaction } from '@modules/transaction/transaction.entity';
import { AccountModule } from '@modules/account/account.module';
import { TransferModule } from '@modules/transfer/transfer.module';
import { FinanceService } from './finance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Transaction]),
    AccountModule,
    TransferModule,
  ],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
