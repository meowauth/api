export interface SocialLoginVerifyResult {
  socialLoginUid: string;
  email: string;
  profileImage?: string;
  credentials?: any;
}

export interface SocialLoginChannel {
  verifyToken(token: string): Promise<SocialLoginVerifyResult>;
}
