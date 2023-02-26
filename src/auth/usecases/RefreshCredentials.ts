import { Service } from 'typedi';
import { AuthConfig } from '~/auth/AuthConfig';
import { AuthError } from '~/auth/errors';
import { Credentials, TokenType } from '~/auth/types';
import { AccountRepository } from '~/account';
import { IssueCredentials } from './IssueCredentials';
import { verifyJWT } from './jwt-utils';

@Service()
export class RefreshCredentials {
  constructor(
    private authConfig: AuthConfig,
    private accountRepository: AccountRepository,
    private issueCredentials: IssueCredentials,
  ) {}

  async call(refreshToken: string): Promise<Credentials> {
    const address = verifyJWT(refreshToken, this.authConfig.jwtSecret, TokenType.REFRESH);
    const account = await this.accountRepository.findOne({ address });
    if (!account) {
      throw new AuthError('unknown account ID');
    }
    return this.issueCredentials.call(account);
  }
}
