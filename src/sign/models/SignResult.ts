export type SignResult = SignResult2FANeeded | SignResultCompleted;

export interface SignResult2FANeeded {
  requestId: number;
  result: '2fa-sent';
  twoFactorSentDeviceName: string;
}

export interface SignResultCompleted {
  requestId: number;
  result: 'signed';
  signatures: string[];
}
