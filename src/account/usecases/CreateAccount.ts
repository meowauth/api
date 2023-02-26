import { randomBytes } from 'crypto';
import { Service } from 'typedi';

export interface Wallet {
  address: string;
  keyIndex: number;
  publicKey: string;
  privateKey: string;
}

@Service()
export class CreateAccount {
  constructor() {}

  async call(): Promise<Wallet> {
    return {
      address: randomBytes(8).toString('hex'),
      keyIndex: 1,
      privateKey: '',
      publicKey: '',
    };
  }
}
