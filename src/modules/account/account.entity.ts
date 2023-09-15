import { User } from '@modules/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import {
  ECurrencyType,
  ESystemAccountType,
  EAccountType,
} from './types/account.types';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EAccountType, default: EAccountType.USER })
  type: EAccountType;

  @Column({
    name: 'system_type',
    type: 'enum',
    enum: ESystemAccountType,
    nullable: true,
  })
  systemType: ESystemAccountType;

  @Column({ type: 'enum', enum: ECurrencyType, nullable: false })
  currency: ECurrencyType;

  @Column({ type: 'bigint', default: 0 })
  balance: number;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.account,
    {
      cascade: true,
    },
  )
  transactions: Transaction[];

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
