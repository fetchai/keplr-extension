import { toBech32 } from "@cosmjs/encoding";
import { Hash, PrivKeySecp256k1 } from "@keplr-wallet/crypto";
import { Env } from "@keplr-wallet/router";
import { KeyRingService } from "../keyring";

export class NameService {
  protected keyRingService!: KeyRingService;

  async init(keyRingService: KeyRingService) {
    this.keyRingService = keyRingService;
  }
  /**
   * Sign the payload
   *
   * @param env The extension environment
   * @param chainId The target chain id
   * @param digest The Uint8Array digest that should be signed
   * @returns The bech32 encoded signature for the verification
   */
  public async sign(
    env: Env,
    chainId: string,
    digest: Uint8Array
  ): Promise<string> {
    const sk = await this.getPrivateKey(env, chainId);
    const privateKey = new PrivKeySecp256k1(sk);
    // sign the payload
    const rawSignature = privateKey.signDigest32(digest);
    // convert and return the signature
    return toBech32("sig", rawSignature, 1000);
  }

  /**
   * Builds a private key from the signature of the current keychain
   *
   * @param env The environment of the extension
   * @param chainId The target chain id
   * @returns The generated private key object
   * @private
   */
  protected async getPrivateKey(
    env: Env,
    chainId: string
  ): Promise<Uint8Array> {
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
              memo: "Create Agent Name Service Secret encryption key. Only approve requests by Keplr.",
              msgs: [],
              sequence: 0,
            })
          )
        )
      )
    );
  }

  public async getPubKey(env: Env, chainId: string): Promise<Uint8Array> {
    const sk = await this.getPrivateKey(env, chainId);
    const privateKey = new PrivKeySecp256k1(sk);
    const pubKey = privateKey.getPubKey().toBytes();
    return pubKey;
  }
}
