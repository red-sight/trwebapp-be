import { ECurrencyType } from '@modules/account/types/account.types';
import { User } from '@modules/user/user.entity';

export interface IDeposit {
  user: User;
  amount: number;
  currency: ECurrencyType;
  desc?: string;
}
