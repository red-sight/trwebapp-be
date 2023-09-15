import { Account } from '@modules/account/account.entity';

export interface ITransferData {
  from: Account;
  to: Account;
  amount: number;
  desc: string;
}
