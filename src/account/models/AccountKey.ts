export interface AccountKey {
  address: string;
  keyId: number;
  type: 'tablet' | 'phone' | 'web' | 'custodial';
  keyName: string;
  isCustodial: boolean;
  publicKey: string;
  privateKey?: string;
  lastUsedLocation: string;
  lastUsedAt: Date;
}

export interface AccountKeyCreation {
  type: 'tablet' | 'phone' | 'web';
  keyName: string;
  publicKey: string;
  privateKey: string;
  isSecp256k1?: boolean;
}
