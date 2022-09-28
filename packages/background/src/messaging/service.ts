import { delay, inject, singleton } from "tsyringe";
import { KeyRingService } from "../keyring";
import { Env } from "@keplr-wallet/router";
import { Hash, PrivKeySecp256k1 } from "@keplr-wallet/crypto";
import { decrypt, encrypt, PrivateKey } from "eciesjs";
import { fromBase64, toBase64, toHex } from "@cosmjs/encoding";
import { getPubKey, registerPubKey } from "./memorandum-client";
import { MESSAGE_CHANNEL_ID } from "./constants";

@singleton()
export class MessagingService {
  // map of target address vs target public key
  // assumption: chainId incorporated since each network will have a different
  // bech32 prefix
  private _publicKeyCache = new Map<string, string>();

  constructor(
    @inject(delay(() => KeyRingService))
    protected readonly keyRingService: KeyRingService
  ) {}

  /**
   * Lookup the public key associated with the messaging service
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param targetAddress Get the public key for the specified address (if specified), otherwise return senders public key
   * @param accessToken accessToken token to authenticate in memorandum service
   * @returns The base64 encoded compressed public key
   */
  public async getPublicKey(
    env: Env,
    chainId: string,
    targetAddress: string | null,
    accessToken: string,
  ): Promise<string | undefined> {
    if (targetAddress === null) {
      const sk = await this.getPrivateKey(env, chainId);
      const privateKey = new PrivateKey(Buffer.from(sk));
      return toBase64(privateKey.publicKey.compressed);
    } else {
      return await this.lookupPublicKey(accessToken, targetAddress);
    }
  }

  /**
   * Register public key in memorandum as messaging key
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param address Wallet bech32 address
   * @param accessToken accessToken token to authenticate in memorandum service
   * @returns The hex encoded compressed public key
   */
  public async registerPublicKey(
    env: Env,
    chainId: string,
    address: string,
    accessToken: string,
  ): Promise<string> {
    const sk = await this.getPrivateKey(env, chainId);
    const privateKey = new PrivateKey(Buffer.from(sk));
    const pubKey = toHex(privateKey.publicKey.compressed);
    
    const regPubKey = await this.lookupPublicKey(accessToken, address);
    if (!regPubKey) await registerPubKey(accessToken, pubKey, address, MESSAGE_CHANNEL_ID);

    return pubKey;
  }

  /**
   * Decrypt a message that is targeted at the private key associated with the
   * messaging service
   *
   * @param env The extention environment
   * @param chainId The target chain id
   * @param cipherText The base64 encoded cipher text to be processed
   * @returns The base64 encoded clear text from the message
   */
  async decryptMessage(
    env: Env,
    chainId: string,
    cipherText: string
  ): Promise<string> {
    const sk = await this.getPrivateKey(env, chainId);
    const rawCipherText = Buffer.from(fromBase64(cipherText));

    return toBase64(decrypt(Buffer.from(sk), rawCipherText));
  }

  /**
   * Encrypt a message using the messaging protocol key
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param targetAddress The target address
   * @param message The base64 encoded message to be processed
   * @param accessToken accessToken token to authenticate in memorandum service
   * @returns The base64 encoded cipher text of the message
   */
  async encryptMessage(
    _env: Env,
    _chainId: string,
    targetAddress: string,
    message: string,
    accessToken: string,
  ): Promise<string> {
    const rawMessage = Buffer.from(fromBase64(message));
    const targetPublicKey = await this.lookupPublicKey(accessToken, targetAddress);

    if (!targetPublicKey) throw new Error("Target pub key not registered");
    const rawTargetPublicKey = Buffer.from(fromBase64(targetPublicKey));

    // encrypt the message
    return toBase64(encrypt(rawTargetPublicKey, rawMessage));
  }

  /**
   * Sign the payload
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param payload The base64 encoded payload that should be signed
   * @returns The base64 encoded signature for the payload
   */
  async sign(env: Env, chainId: string, payload: string): Promise<string> {
    const sk = await this.getPrivateKey(env, chainId);
    const privateKey = new PrivKeySecp256k1(sk);

    // decode the payload into raw bytes
    const rawPayload = fromBase64(payload);

    // sign the payload
    const rawSignature = privateKey.sign(rawPayload);

    // convert and return the signature
    return toBase64(rawSignature);
  }

  /**
   * Lookup the public key for a target address
   *
   * Will first check the local cache, if not present will attempt to lookup the
   * information from the memorandum service
   * @param accessToken accessToken token to authenticate in memorandum service
   * @param targetAddress The target address to find the public key for
   * @returns The base64 encoded public key for the target address if successful
   * @protected
   */
  protected async lookupPublicKey(accessToken: string, targetAddress: string): Promise<string | undefined> {
    // Step 1. Query the cache
    let targetPublicKey = this._publicKeyCache.get(targetAddress);
    if (targetPublicKey !== undefined) {
      return targetPublicKey;
    }

    // Step 2. Cache miss, fetch the public key from the memorandum service and
    //         update the cache
    targetPublicKey = await this.fetchPublicKey(accessToken, targetAddress);
    
    if (!targetPublicKey) return;
    this._publicKeyCache.set(targetAddress, targetPublicKey);

    return targetPublicKey;
  }

  /**
   * Fetch the public key information for a specificed address from the memorandum
   * service
   *
   * @param accessToken accessToken token to authenticate in memorandum service
   * @param targetAddress The address to lookup the public key for
   * @returns The base64 encoded public key for the target address if successful
   * @private
   */
  private async fetchPublicKey(accessToken: string, _targetAddress: string): Promise<string | undefined> {
    // TODO(EJF): Query the memorandum service for the public key associated with the target address
    const pubKey = await getPubKey(accessToken, _targetAddress, MESSAGE_CHANNEL_ID);
    
    if (!pubKey) return;

    return pubKey;
  }

  /**
   * Builds a private key from the signature of the current keychain
   *
   * @param env The environment of the extension
   * @param chainId The target chain id
   * @returns The generated private key object
   * @private
   */
  private async getPrivateKey(env: Env, chainId: string): Promise<Uint8Array> {
    return Hash.sha256(
      Buffer.from(
        await this.keyRingService.sign(
          env,
          chainId,
          Buffer.from(
            JSON.stringify({
              account_number: 0,
              chain_id: chainId,
              fee: [],
              memo:
                "Create Messaging Signing Secret encryption key. Only approve requests by Keplr.",
              msgs: [],
              sequence: 0,
            })
          )
        )
      )
    );
  }
}
