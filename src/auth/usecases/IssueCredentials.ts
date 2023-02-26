import { Service } from 'typedi';
import { Account } from '~/account';
import { AuthConfig } from '../AuthConfig';
import { Credentials, TokenType } from '../types';
import { issueJWT } from './jwt-utils';

@Service()
export class IssueCredentials {
  constructor(private authConfig: AuthConfig) {}

  call(account: Account): Credentials {
    return {
      accessToken: issueJWT(TokenType.ACCESS, account, this.authConfig.accessTokenExpiresIn, this.authConfig.jwtSecret),
      refreshToken: issueJWT(
        TokenType.REFRESH,
        account,
        this.authConfig.refreshTokenExpiresIn,
        this.authConfig.jwtSecret,
      ),
    };
  }
}
