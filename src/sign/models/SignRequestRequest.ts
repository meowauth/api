export interface SignRequestRequest {
  address: string;
  displayType: 'add-key' | 'revoke-key' | 'nft-send' | 'ft-send' | 'general-tx';
  displayMetadata: { [k: string]: string };
  payload: string;
}
