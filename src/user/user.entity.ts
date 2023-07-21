import { WebAppUser } from 'src/auth/interfaces/WebAppUser.interface';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'bigint', name: 'tg_id' })
  tgId: number;

  @Column({ type: 'jsonb', name: 'tg_init_data' })
  tgInitData: Partial<WebAppUser>;

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
