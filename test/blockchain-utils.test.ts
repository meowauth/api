import { times } from 'lodash';
import { generateKeys, sign, verify } from '../src/blockchain/utils';

describe('sign and verify', () => {
  it('should verify signature', async () => {
    const [a, b] = await Promise.all(times(2).map(() => generateKeys()));
    const payload = 'deadbeef';

    const signature = await sign(payload, a.privateKey);
    const verified = await verify(payload, a.publicKey, signature);
    expect(verified).toBeTruthy();

    const verifiedB = await verify(payload, b.publicKey, signature);
    expect(verifiedB).toBeFalsy();
  });
});
