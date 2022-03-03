export interface UmbralEncryptionResult {
  cipherText: Uint8Array;
  capsule: Uint8Array;
}

export interface UmbralKeyFragment {
  data: Uint8Array;
}

/**
 * The interface that will be exposed the window client
 */
export interface UmbralApi {
  /**
   * Get the associated umbral public key that was generated for this account
   *
   * @param chainId The target chain id
   */
  getPublicKey(chainId: string): Promise<Uint8Array>;

  getSigningPublicKey(chainId: string): Promise<Uint8Array>;

  encrypt(
    chainId: string,
    plainTextBytes: Uint8Array
  ): Promise<UmbralEncryptionResult>;

  generateKeyFragments(
    chainId: string,
    receiverPublicKey: Uint8Array,
    threshold: number,
    shares: number
  ): Promise<UmbralKeyFragment[]>;

  decrypt(chainId: string, cipherTextBytes: Uint8Array): Promise<Uint8Array>;

  decryptReEncrypted(
    chainId: string,
    senderPublicKey: Uint8Array,
    capsule: Uint8Array,
    capsuleFragments: Uint8Array[],
    cipherTextBytes: Uint8Array
  ): Promise<Uint8Array>;

  verifyCapsuleFragment(
    capsuleFragment: Uint8Array,
    capsule: Uint8Array,
    verifyingPublicKey: Uint8Array,
    senderPublicKey: Uint8Array,
    receiverPublicKey: Uint8Array
  ): Promise<boolean>;
}
