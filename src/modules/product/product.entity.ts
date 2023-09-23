import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'price', type: 'bigint' })
  price: number;

  @CreateDateColumn({ name: 'ctime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'mtime' })
  updatedAt: string;
}
