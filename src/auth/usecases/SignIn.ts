import { Service } from 'typedi';
import { SignInAndUpInput } from '~/auth';
import { NoAccount } from '~/auth/errors';
import { Account, AccountRepository } from '~/account';
import { LoginChannels } from './social-logins';

@Service()
export class SignIn {
  constructor(private accountRepository: AccountRepository, private loginChannels: LoginChannels) {}

  // TODO: transactional
  async call({ channel, token }: SignInAndUpInput): Promise<Account> {
    const loginChannel = this.loginChannels.getLoginChannel(channel);
    const { socialLoginUid } = await loginChannel.verifyToken(token);

    const account = await this.accountRepository.findOne({ firebaseUid: socialLoginUid });
    if (!account) {
      throw new NoAccount();
    }
    return account;
  }
}
