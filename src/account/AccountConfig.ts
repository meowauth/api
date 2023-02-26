import { ConfigKey } from '~/utils';

export class AccountConfig {
  @ConfigKey({ env: 'ACCOUNT_EXAMPLE' })
  example: string;
}
