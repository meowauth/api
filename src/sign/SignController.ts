import { Body, Path, Post, Request, Route, Security, Tags } from '@tsoa/runtime';
import Koa from 'koa';
import { Service } from 'typedi';
import { SignApproval, SignRequestRequest } from './models';
import { SignRepository } from './SignRepository';
import { ApproveSign, RequestSign } from './usecases';

@Service()
@Tags('Sign')
@Route('/sign/v1')
export class SignController {
  constructor(
    private signRepository: SignRepository,
    private requestSign: RequestSign,
    private approveSign: ApproveSign,
  ) {}

  @Post('/')
  async request(@Body() signReq: SignRequestRequest) {
    return await this.requestSign.call(signReq);
  }

  @Post('/:requestId/approve')
  @Security('JWT')
  async approve(@Request() { user }: Koa.Request, @Path() requestId: number, @Body() approval: SignApproval) {
    return await this.approveSign.call(user, requestId, approval);
  }
}
