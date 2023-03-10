export interface SignRequest {
  id: number;
  address: string;
  status: 'in-wait' | 'approved';
  displayType: 'add-key' | 'revoke-key' | 'nft-send' | 'ft-send' | 'general-tx';
  displayMetadata: { [k: string]: string };
  payload: string;
  quorum: QuorumEntry[];
}

export interface QuorumEntry {
  keyId: number;
  weight: number;
  signature: string;
}
