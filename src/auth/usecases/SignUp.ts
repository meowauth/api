import { generateSlug } from 'random-word-slugs';
import { Service } from 'typedi';
import { Account, AccountRepository, CreateAccountOnChain } from '~/account';
import { SignUpInput } from '../types';
import { LoginChannels } from './social-logins';

@Service()
export class SignUp {
  constructor(
    private accountRepository: AccountRepository,
    private loginChannels: LoginChannels,
    private createWallet: CreateAccountOnChain,
  ) {}

  // TODO: transactional
  async call({ channel, token, initialDeviceKey }: SignUpInput): Promise<Account> {
    const loginChannel = this.loginChannels.getLoginChannel(channel);
    const socialLoginResult = await loginChannel.verifyToken(token);

    const { address, custodialKey } = await this.createWallet.call(initialDeviceKey.publicKey);
    const account = await this.accountRepository.create({
      alias: generateSlug(2) + '.fn',
      profileImage: socialLoginResult.profileImage,
      firebaseUid: socialLoginResult.socialLoginUid,
      address: address,
    });

    await this.accountRepository.createKey(address, {
      keyName: `MeowAuth Custodial Key`,
      isCustodial: true,
      publicKey: custodialKey.publicKey,
      privateKey: custodialKey.privateKey,
      keyId: 1,
    });
    await this.accountRepository.createKey(address, {
      ...initialDeviceKey,
      keyId: 2,
    });
    return account;
  }
}
