import { randomBytes, randomUUID } from 'crypto';
import { Service } from 'typedi';
import { Account } from '~/account';
import { ValidationError } from '../../../errors';
import { AuthConfig } from '../../AuthConfig';
import { SocialLoginChannel, SocialLoginVerifyResult } from './types';

@Service()
export class TestLogin implements SocialLoginChannel {
  constructor(private authConfig: AuthConfig) {}

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    return;
  }

  /**
   */
  async verifyToken(token: string): Promise<SocialLoginVerifyResult> {
    if (process.env.NODE_ENV === 'production') {
      throw new ValidationError('unsupported method');
    }
    if (token !== this.authConfig.testLoginSecret) {
      throw new ValidationError('secret mismatch');
    }
    return {
      socialLoginUid: 'test:' + randomUUID(),
      email: `${randomBytes(8).toString('hex')}}@test.com`,
      credentials: '',
    };
  }

  async saveCredential(account: Account, { email, socialLoginUid, credentials }: SocialLoginVerifyResult) {}
}
