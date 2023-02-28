import { sample } from 'lodash';
import { Service } from 'typedi';
import { Account, AccountRepository, SendPush } from '~/account';
import { sign } from '~/blockchain';
import { SignRequest, SignRequestRequest, SignResult } from '../models';
import { SignRepository } from '../SignRepository';
import { ValidateSignature } from './ValidateSignature';

@Service()
export class RequestSign {
  constructor(
    private accountRepository: AccountRepository,
    private signRepository: SignRepository,
    private validateSignature: ValidateSignature,
    private sendPush: SendPush,
  ) {}

  async call(request: SignRequestRequest): Promise<SignResult> {
    const { account, quorumEntry } = await this.validateSignature.call(
      request.address,
      request.payload,
      request.currentDevice,
    );
    const quorum = [quorumEntry];

    // try to sign with custodial key (auto-sign key)
    const custodialKey = account.keys.find((it) => it.isCustodial);
    if (custodialKey) {
      quorum.push({
        keyId: custodialKey.keyId,
        weight: custodialKey.weight,
        signature: await sign(request.payload, custodialKey.privateKey!),
      });
    }
    const signRequest = await this.signRepository.createRequest({ ...request, quorum });

    if (quorum.length < 1000) {
      // failed to reach quorum: assuming key weight = 500, at least 2 keys are needed to sign a transaction.
      // probably user revoked custodial auto-sign key
      await this.sendTwoFactorAuth(account, request, signRequest);
      return {
        result: '2fa-sent',
        requestId: signRequest.id,
        twoFactorSentDeviceName: sample(account.keys)?.keyName!,
      };
    }
    await this.signRepository.updateRequest(signRequest.id, { status: 'approved' });
    return {
      result: 'signed',
      requestId: signRequest.id,
      signatures: quorum.map((it) => it.signature),
    };
  }

  private async sendTwoFactorAuth(account: Account, request: SignRequestRequest, signRequest: SignRequest) {
    await this.sendPush.call(account, {
      notification: {
        title: this.titleByType(request.displayType),
        body: `Tap to verify ${account.alias}`,
      },
      data: {
        type: '2fa-sign-request',
        payload: JSON.stringify({
          requestId: signRequest.id,
          address: request.address,
          displayType: request.displayType,
          displayMetadata: request.displayMetadata,
          payload: request.payload,
        }),
      },
    });
  }

  private titleByType(type: SignRequest['displayType']) {
    switch (type) {
      case 'add-key':
        return `Confirm You Signing In`;
      case 'revoke-key':
        return `Confirm You Removing Device`;
      case 'nft-send':
        return `Confirm You Sending a NFT`;
      case 'ft-send':
        return `Confirm You Sending a Token`;
      case 'general-tx':
        return `Confirm You Sending a Transaction`;
    }
  }
}
