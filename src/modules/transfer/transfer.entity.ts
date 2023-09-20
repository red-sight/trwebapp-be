import { Transaction } from '../transaction/transaction.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 512 })
  desc: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transfer, {
    cascade: true,
  })
  transactions: Transaction[];

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
