import { Body, Post, Route, SuccessResponse, Tags } from '@tsoa/runtime';
import { Service } from 'typedi';
import { JWT, SignInAndUpInput } from './types';
import { IssueCredentials, RefreshCredentials, SignIn, SignUp } from './usecases';

interface RefreshTokenRequest {
  refreshToken: JWT;
}

export type SignInRequest = SignInAndUpInput;
export type SignUpRequest = SignInAndUpInput;

@Service()
@Tags('Auth')
@Route('/auth/v1')
export class AuthController {
  constructor(
    private signIn: SignIn,
    private signUp: SignUp,
    private issueCredentials: IssueCredentials,
    private refreshCredentials: RefreshCredentials,
  ) {}

  /**
   * @summary Sign In
   */
  @Post('/signin')
  async doSignIn(@Body() request: SignInRequest) {
    const account = await this.signIn.call(request);
    const credentials = this.issueCredentials.call(account);
    return { account, credentials };
  }

  /**
   * @summary Sign Up
   */
  @Post('/signup')
  @SuccessResponse(201)
  async doSignUp(@Body() request: SignUpRequest) {
    const account = await this.signUp.call(request);
    const credentials = this.issueCredentials.call(account);

    return { account, credentials };
  }

  /**
   * @summary Refresh Credentials by Refresh Token
   */
  @Post('/refresh')
  async refreshToken(@Body() { refreshToken }: RefreshTokenRequest) {
    const credentials = await this.refreshCredentials.call(refreshToken);
    return { credentials };
  }
}
