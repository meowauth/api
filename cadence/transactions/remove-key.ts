export const REMOVE_KEY = `
transaction (keyIndex: Int) {
    prepare(account: AuthAccount) {
        let keyToRemove = account.keys.get(keyIndex: keyIndex) ?? panic("given key index not found")

        var totalWeight = 0.0
        account.keys.forEach(fun (key: AccountKey): Bool {
            totalWeight = totalWeight + key.weight
            return true
        })
        assert(totalWeight - keyToRemove.weight >= 1000.0, message: "you're trying to revoke too much key")
        account.keys.revoke(keyIndex: keyIndex)
    }
}`;
