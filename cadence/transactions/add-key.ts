export const ADD_KEY = `transaction (newPubKey: String, signatureType: String) {
    prepare(account: AuthAccount) {
        var signatureAlgorithm = SignatureAlgorithm.ECDSA_P256
        if signatureType == "secp256k1" {
            signatureAlgorithm = SignatureAlgorithm.ECDSA_secp256k1
        }

        account.keys.add(
            publicKey: PublicKey(
                publicKey: newPubKey.decodeHex(),
                signatureAlgorithm: signatureAlgorithm
            ),
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 500.0,
        )
    }
}`;
