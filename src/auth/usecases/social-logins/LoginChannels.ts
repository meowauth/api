import { Service } from 'typedi';
import { ValidationError } from '~/errors';
import { SocialLoginType } from '../../types';
import { FirebaseLogin } from './FirebaseLogin';
import { TestLogin } from './TestLogin';
import { SocialLoginChannel } from './types';

/**
 * Aggregates all available login channels.
 */
@Service()
export class LoginChannels {
  private readonly loginChannels: { [channel in SocialLoginType]: SocialLoginChannel };

  constructor(private firebaseLogin: FirebaseLogin, private testLogin: TestLogin) {
    this.loginChannels = {
      firebase: firebaseLogin,
      test: testLogin,
    };
  }

  getLoginChannel(channelType: SocialLoginType): SocialLoginChannel {
    const channel = this.loginChannels[channelType];
    if (!channel) {
      throw new ValidationError(`invalid channel type: ${channelType}`, { available: Object.keys(this.loginChannels) });
    }
    return channel;
  }
}
