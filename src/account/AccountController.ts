import { Body, Get, Put, Request, Route, Security, Tags } from '@tsoa/runtime';
import Koa from 'koa';
import { Service } from 'typedi';
import { AccountRepository } from './AccountRepository';

@Service()
@Tags('Account')
@Route('/account/v1')
export class AccountController {
  constructor(private accountRepository: AccountRepository) {}

  /**
   * @summary Get My Details
   */
  @Get('/me')
  @Security('JWT')
  async getMyProfile(@Request() { user }: Koa.Request) {
    const accountDetails = await this.accountRepository.details(user.address);
    return { accountDetails };
  }

  /**
   * @summary Register Push Tokens
   */
  @Put('/push-tokens')
  @Security('JWT')
  async registerPushToken(@Request() { user }: Koa.Request, @Body() body: { pushToken: string; deviceLocale: string }) {
    await this.accountRepository.registerPushToken(user.address, body);
  }
}
