import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { Account } from '@modules/account/account.entity';
import { AccountModule } from '@modules/account/account.module';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer]),
    TypeOrmModule.forFeature([Account]),
    AccountModule,
    TransactionModule,
  ],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule {}
