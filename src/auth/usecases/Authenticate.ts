import { Service } from 'typedi';
import { Account, AccountRepository } from '~/account';
import { AuthConfig } from '../AuthConfig';
import { AuthError } from '../errors';
import { verifyJWT } from './jwt-utils';

/**
 * Authenticates using given JWT access token.
 */
@Service()
export class Authenticate {
  constructor(private authConfig: AuthConfig, private accountRepository: AccountRepository) {}

  /**
   * @param accessToken A JWT token you want to authenticate
   * @returns A corresponding {@link Account} by the token
   * @throws AuthError if fails
   */
  async call(accessToken: string): Promise<Account> {
    const address = verifyJWT(accessToken, this.authConfig.jwtSecret);
    const account = await this.accountRepository.findOne({ address });
    if (!account) {
      throw new AuthError('account does not exist');
    }
    return account;
  }
}
