import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Transfer } from '../transfer/transfer.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'bigint', nullable: false })
  amount: number;

  @Column({ nullable: false, length: 512 })
  desc: string;

  @Column({ type: 'bigint', name: 'running_balance' })
  runningBalance: number;

  @ManyToOne(() => Account, (account: Account) => account.transactions)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => Transfer, (transfer: Transfer) => transfer.transactions)
  @JoinColumn({ name: 'transfer_id', referencedColumnName: 'id' })
  transfer: Transfer;

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
