import { Account } from '@modules/account/account.entity';

export interface ICreateTransaction {
  account: Account;
  amount: number;
  desc: string;
  runningBalance: number;
}
