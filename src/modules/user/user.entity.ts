import { WebAppUser } from '@modules/auth/interfaces/WebAppUser.interface';
import { Account } from '@modules/account/account.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'bigint', name: 'tg_id' })
  tgId: number;

  @Column({ type: 'jsonb', name: 'tg_init_data' })
  tgInitData: Partial<WebAppUser>;

  @OneToMany(() => Account, (account: Account) => account.user, {
    cascade: true,
  })
  accounts: Account[];

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
