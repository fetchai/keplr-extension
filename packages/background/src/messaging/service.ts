import { delay, inject, singleton } from "tsyringe";
import { KeyRingService } from "../keyring";
import { Env } from "@keplr-wallet/router";
import { Hash } from "@keplr-wallet/crypto";
import { decrypt, encrypt, PrivateKey } from "eciesjs";
import { fromBase64, toBase64 } from "@cosmjs/encoding";

@singleton()
export class MessagingService {
  private _publicKeyCache: Map<string, string>;

  constructor(
    @inject(delay(() => KeyRingService))
    protected readonly keyRingService: KeyRingService
  ) {
    this._publicKeyCache = new Map<string, string>();
  }

  /**
   * Lookup the public key associated with the messaging service
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @returns The base64 encoded compressed public key
   */
  public async getPublicKey(env: Env, chainId: string): Promise<string> {
    const privateKey = await this.getPrivateKey(env, chainId);
    return toBase64(privateKey.publicKey.compressed);
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

    return toBase64(decrypt(sk.secret, rawCipherText));
  }

  /**
   * Encrypt a message using the messaging protocol key
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param targetAddress The target address
   * @param message The base64 encoded message to be processed
   * @returns The base64 encoded cipher text of the message
   */
  async encryptMessage(
    _env: Env,
    _chainId: string,
    targetAddress: string,
    message: string
  ): Promise<string> {
    const rawMessage = Buffer.from(fromBase64(message));
    const targetPublicKey = await this.lookupPublicKey(targetAddress);

    // encrypt the message
    return toBase64(encrypt(targetPublicKey, rawMessage));
  }

  /**
   * Lookup the public key for a target address
   *
   * Will first check the local cache, if not present will attempt to lookup the
   * information from the memorandum service
   *
   * @param targetAddress The target address to find the public key for
   * @returns The base64 encoded public key for the target address if successful
   * @protected
   */
  protected async lookupPublicKey(targetAddress: string): Promise<string> {
    // Step 1. Query the cache
    let targetPublicKey = this._publicKeyCache.get(targetAddress);
    if (targetPublicKey !== undefined) {
      return targetPublicKey;
    }

    // Step 2. Cache miss, fetch the public key from the memorandum service and
    //         update the cache
    targetPublicKey = await this.fetchPublicKey(targetAddress);
    this._publicKeyCache.set(targetAddress, targetPublicKey);

    return targetPublicKey;
  }

  /**
   * Fetch the public key information for a specificed address from the memorandum
   * service
   *
   * @param targetAddress The address to lookup the public key for
   * @returns The base64 encoded public key for the target address if successful
   * @private
   */
  private async fetchPublicKey(_targetAddress: string): Promise<string> {
    // TODO(EJF): Query the memorandum service for the public key associated with the target address
    throw new Error(
      "Not currently implemented - I need to query the memorandum service to lookup the public key"
    );
  }

  /**
   * Builds a private key from the signature of the current keychain
   *
   * @param env The environment of the extension
   * @param chainId The target chain id
   * @returns The generated private key object
   * @private
   */
  private async getPrivateKey(env: Env, chainId: string): Promise<PrivateKey> {
    const rawPrivateKey = Buffer.from(
      Hash.sha256(
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
      )
    );

    return new PrivateKey(rawPrivateKey);
  }
}
