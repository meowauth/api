import { log } from 'pine-log';
import { Service } from 'typedi';
import { AdminWallet, generateKeys, waitForTx } from '~/blockchain';
import { CREATE_ACCOUNT } from '../../../cadence/transactions/create-account';

export interface CreateAccountResult {
  address: string;
  custodialKey: {
    keyIndex: number;
    publicKey: string;
    privateKey: string;
  };
}

const FLOW_CHARGE_AMOUNT = '0.1';
const ACCOUNT_NAME = 'MeowAuth Account';
const ACCOUNT_DESCRIPTION = 'Proxy Account for MeowAuth';
const APP_LOGO = 'https://placekitten.com/400/400';
const APP_URL = 'https://meowauth.io/';

@Service()
export class CreateAccountOnChain {
  constructor(private adminWallet: AdminWallet) {}

  async call(initialDevicePublicKey: string): Promise<CreateAccountResult> {
    const { privateKey, publicKey } = await generateKeys();

    const txId = await this.adminWallet.mutate(CREATE_ACCOUNT, (arg: any, t: any) => [
      arg(publicKey, t.String),
      arg(initialDevicePublicKey, t.String),
      arg(FLOW_CHARGE_AMOUNT, t.UFix64),
      arg(ACCOUNT_NAME, t.String),
      arg(ACCOUNT_DESCRIPTION, t.String),
      arg(APP_LOGO, t.String),
      arg(APP_URL, t.String),
    ]);
    log.debug(`account create Tx sent`, { txId });
    const { events } = await waitForTx(txId);

    const address = events.find((it: any) => it.type === 'flow.AccountCreated')?.data?.address as string;
    if (!address) {
      throw new Error(`flow.AccountCreated event not found on ${txId}: raw events are ${JSON.stringify(events)}`);
    }

    return {
      address,
      custodialKey: {
        keyIndex: 1,
        privateKey,
        publicKey,
      },
    };
  }
}
