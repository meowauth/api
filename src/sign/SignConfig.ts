import { ConfigKey } from '~/utils';

export class SignConfig {
  @ConfigKey({ env: 'SIGN_EXAMPLE' })
  example: string;
}
