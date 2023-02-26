export const CREATE_ACCOUNT = `
import ChildAccount from 0xChildAccount.cdc
import MetadataViews from 0xMetadataViews
import FungibleToken from 0xFungibleToken

transaction (
    custodialPubKey: String,
    userDevicePubKey: String,
    fundingAmt: UFix64,
    childAccountName: String,
    childAccountDescription: String,
    clientIconURL: String,
    clientExternalURL: String,
) {
    prepare(signer: AuthAccount) {
        // 1. Create a new child account
        // Get a reference to the signer's ChildAccountCreator
        let creator = signer.borrow<&ChildAccount.ChildAccountCreator>(from: ChildAccount.ChildAccountCreatorStoragePath)
            ?? panic("No ChildAccountCreator in signer's account; please run setup-child-account-creator.cdc first")

        // Construct the ChildAccountInfo metadata struct
        let info = ChildAccount.ChildAccountInfo(
            name: childAccountName,
            description: childAccountDescription,
            clientIconURL: MetadataViews.HTTPFile(url: clientIconURL),
            clienExternalURL: MetadataViews.ExternalURL(clientExternalURL),
            originatingPublicKey: custodialPubKey
        )

        // Create the account
        let newAccount = creator.createChildAccount(
            signer: signer,
            initialFundingAmount: fundingAmt,
            childAccountInfo: info
        )
        // this is most important: remove first key since it has weight 1000
        newAccount.keys.revoke(keyIndex: 0)

        // add custodial key as key #1
        newAccount.keys.add(
            publicKey: PublicKey(
                publicKey: custodialPubKey.decodeHex(),
                signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
            ),
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 500.0,
        )

        // add user key as key #2
        newAccount.keys.add(
            publicKey: PublicKey(
                publicKey: userDevicePubKey.decodeHex(),
                signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
            ),
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 500.0,
        )
    }
}`;
