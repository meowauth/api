import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { Account } from '~/account';
import { AuthError } from '../errors';
import { JWTPayload, TokenType } from '../types';

/**
 * Creates a JWT token.
 * @param type `'access'` or `'refresh'`
 * @param account the account you want to issue JWT for
 * @param expiresIn whether `AuthConfig.accessTokenExpiresIn` or `AuthConfig.refreshTokenExpiresIn`
 * @param secret `AuthConfig.jwtSecret`
 */
export const issueJWT = (type: TokenType, account: Account, expiresIn: string | number, secret: string): string =>
  sign({ type } as JWTPayload, secret, {
    subject: account.address,
    expiresIn,
  });

/**
 * Verifies given JWT token.
 *
 * @param token
 * @param secret
 * @param expectedType
 * @returns An account ID of the token.
 */
export function verifyJWT(token: string, secret: string, expectedType = TokenType.ACCESS): string {
  let payload: JWTPayload;
  try {
    payload = verify(token, secret) as JWTPayload;
  } catch (err) {
    throw new AuthError((err as JsonWebTokenError).message);
  }

  const { type, sub: accountAddress } = payload;
  if (type !== expectedType) {
    throw new AuthError(`invalid token: its type should be ${expectedType} token`);
  }
  if (!accountAddress) {
    throw new AuthError('invalid token: no subject in the JWT payload');
  }
  return accountAddress;
}
