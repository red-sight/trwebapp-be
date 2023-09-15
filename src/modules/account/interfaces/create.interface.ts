import {
  EAccountType,
  ECurrencyType,
  ESystemAccountType,
} from '../types/account.types';

export interface ICreateAccount {
  type?: EAccountType;
  systemType?: ESystemAccountType;
  currency: ECurrencyType;
}
