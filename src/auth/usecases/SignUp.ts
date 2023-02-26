import { generateSlug } from 'random-word-slugs';
import { Service } from 'typedi';
import { Account, AccountRepository } from '~/account';
import { CreateAccount } from '~/account';
import { SignInAndUpInput } from '../types';
import { LoginChannels } from './social-logins';

@Service()
export class SignUp {
  constructor(
    private accountRepository: AccountRepository,
    private loginChannels: LoginChannels,
    private createWallet: CreateAccount,
  ) {}

  // TODO: transactional
  async call({ channel, token }: SignInAndUpInput): Promise<Account> {
    const loginChannel = this.loginChannels.getLoginChannel(channel);
    const socialLoginResult = await loginChannel.verifyToken(token);

    const wallet = await this.createWallet.call();
    return await this.accountRepository.create({
      alias: generateSlug(2) + '.fn',
      profileImage: socialLoginResult.profileImage,
      firebaseUid: socialLoginResult.socialLoginUid,
      address: wallet.address,
      keys: [],
    });
  }
}
