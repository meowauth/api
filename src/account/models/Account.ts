import { AccountKey } from './AccountKey';

export interface Account {
  address: string;
  alias: string;
  profileImage?: string;
}

export interface AccountDetails extends Account {
  keys: AccountKey[];
}
