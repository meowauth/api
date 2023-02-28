import { Service } from 'typedi';
import { Account, SendPush } from '~/account';
import { NotFoundError } from '../../errors';
import { SignApproval, SignResultCompleted } from '../models';
import { SignRepository } from '../SignRepository';
import { ValidateSignature } from './ValidateSignature';

@Service()
export class ApproveSign {
  constructor(
    private signRepository: SignRepository,
    private validateSignature: ValidateSignature,
    private sendPush: SendPush,
  ) {}

  async call(account: Account, requestId: number, approval: SignApproval): Promise<SignResultCompleted> {
    const request = await this.signRepository.getRequest(requestId);
    if (!request) {
      throw new NotFoundError(`sign request ${requestId} not found`);
    }
    const { quorumEntry } = await this.validateSignature.call(account.address, request.payload, approval.currentDevice);
    const quorum = [...request.quorum, quorumEntry];

    // cancel other requests
    await this.sendPush.call(account, {
      // foreground push only
      data: {
        type: '2fa-sign-request-finished',
        payload: JSON.stringify({
          requestId,
          address: request.address,
          displayType: request.displayType,
          displayMetadata: request.displayMetadata,
          payload: request.payload,
        }),
      },
    });

    await this.signRepository.updateRequest(requestId, { status: 'approved', quorum });
    return {
      result: 'signed',
      requestId,
      signatures: quorum.map((it) => it.signature),
    };
  }
}
