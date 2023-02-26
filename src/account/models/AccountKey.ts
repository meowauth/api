export interface AccountKey {
  address: string;
  keyId: number;
  type: "tablet" | "phone" | "web" | "custodial";
  keyName: string;
  isCustodial: boolean;
  publicKey: string;
  privateKey?: string;
  lastUsedLocation: string;
  lastUsedAt: Date;
}
