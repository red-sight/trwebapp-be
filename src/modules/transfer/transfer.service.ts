import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { Repository } from 'typeorm';
import { ITransferData } from './interfaces/transfer.interface';
import { TransactionService } from '@modules/transaction/transaction.service';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly transactionService: TransactionService,
  ) {}

  public async createTransfer(transferData: ITransferData): Promise<Transfer> {
    const { from, to, amount, desc } = transferData;
    const transfer = this.transferRepository.create({
      desc,
      transactions: [
        this.transactionService.create({
          account: from,
          amount: -amount,
          desc,
          runningBalance: from.balance - amount,
        }),
        this.transactionService.create({
          account: to,
          amount: amount,
          desc,
          runningBalance: to.balance + amount,
        }),
      ],
    });

    await this.transferRepository.save(transfer);
    return transfer;
  }
}
