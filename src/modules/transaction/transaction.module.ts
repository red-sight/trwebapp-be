import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { Account } from '@modules/account/account.entity';
import { Transfer } from '@modules/transfer/transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([Transfer]),
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
