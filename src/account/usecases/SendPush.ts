import { BaseMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { log } from 'pine-log';
import { Service } from 'typedi';
import { FirebaseService } from '~/firebase';
import { AccountRepository } from '../AccountRepository';
import { Account } from '../models';

@Service()
export class SendPush {
  constructor(private firebase: FirebaseService, private accountRepo: AccountRepository) {}

  async call(account: Account, message: BaseMessage) {
    const pushTokens = await this.accountRepo.listPushTokens(account.address);

    const result = await this.firebase.messaging().sendMulticast({
      ...message,
      tokens: pushTokens.map((it) => it.pushToken),
    });
    if (result.failureCount > 0) {
      const tokensToDelete = <string[]>[];
      result.responses.forEach((it, index) => {
        if (!it.success) {
          tokensToDelete.push(pushTokens[index].pushToken);
        }
      });
      log.info('revoking failed registration tokens', { account: account.address, tokensToDelete });
      await this.accountRepo.removePushTokens(tokensToDelete);
    }
  }
}
