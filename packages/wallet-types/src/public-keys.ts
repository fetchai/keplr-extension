export interface PublicKey {
    readonly type: "tendermint/PubKeySecp256k1" | "tendermint/PubKeyEd25519"
    readonly value: any;
}

export interface Ed25519PublicKey extends PublicKey {
    readonly type: "tendermint/PubKeyEd25519";
    readonly value: Uint8Array;
}

export interface Secp256k1PublicKey extends PublicKey {
    readonly type: "tendermint/PubKeySecp256k1";
    readonly value: Uint8Array;
}

export function isSecp256k1PublicKey(publicKey: PublicKey): publicKey is Secp256k1PublicKey {
    return publicKey.type === "tendermint/PubKeySecp256k1";
}

export function isEd25519PublicKey(publicKey: PublicKey): publicKey is Ed25519PublicKey {
    return publicKey.type === "tendermint/PubKeyEd25519";
}
