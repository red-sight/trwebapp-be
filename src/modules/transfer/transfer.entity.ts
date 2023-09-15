import { Transaction } from '../transaction/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false, length: 512 })
  desc: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transfer)
  @JoinColumn({ name: 'transfer_id', referencedColumnName: 'id' })
  transactions: Transaction[];

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
