import { Service } from 'typedi';
import { FirebaseService } from '~/firebase';
import { SocialLoginChannel, SocialLoginVerifyResult } from './types';

@Service()
export class FirebaseLogin implements SocialLoginChannel {
  constructor(private firebaseService: FirebaseService) {}

  /**
   * @param token Google OAuth redirect code from the client.
   */
  async verifyToken(token: string): Promise<SocialLoginVerifyResult> {
    const { email, uid, profileImage } = await this.firebaseService.verifyIdToken(token);
    return {
      socialLoginUid: uid,
      email: email!,
      profileImage,
      credentials: token,
    };
  }
}
