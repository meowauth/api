import { Service } from 'typedi';
import { AccountDetails, AccountRepository } from '../../account';
import { verify } from '~/blockchain';
import { NotFoundError, ValidationError } from '../../errors';
import { QuorumEntry, Signature } from '../models';

interface ValidateSignatureResult {
  account: AccountDetails;
  quorumEntry: QuorumEntry;
}

@Service()
export class ValidateSignature {
  constructor(private accountRepository: AccountRepository) {}

  async call(address: string, payload: string, { signature, publicKey }: Signature): Promise<ValidateSignatureResult> {
    const account = await this.accountRepository.details(address);
    if (!account) {
      throw new NotFoundError(`account ${address} not found`);
    }
    const key = account.keys.find((it) => it.publicKey === publicKey);
    if (!key) {
      throw new ValidationError(`invalid public key: not registered`);
    }
    const verified = await verify(payload, publicKey, signature);
    if (!verified) {
      throw new ValidationError(`invalid signature: does not match with public key or payload`);
    }
    return {
      account,
      quorumEntry: { keyId: key.keyId, weight: key.weight, signature },
    };
  }
}
