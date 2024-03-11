import { JSONUint8Array } from "@keplr-wallet/router";
import {
  UmbralApi,
  UmbralEncryptionResult,
  UmbralKeyFragment,
} from "@fetchai/umbral-types";
import { UmbralMethod } from "./types";
import {
  createBrowserWindowProxy,
  createProxyRequest,
  Proxy,
  toProxyResponse,
} from "./proxy";
import { FetchBrowserWallet, WalletApi } from "@fetchai/wallet-types";
import { Keplr } from "@keplr-wallet/types";
import {
  InjectedFetchAccount,
  InjectedFetchAddressBook,
  InjectedFetchNetworks,
  InjectedFetchSigning,
  InjectedFetchWalletApi,
} from "./wallet-api";

class BrowserInjectedUmbral implements UmbralApi {
  constructor(protected readonly proxy: Proxy) {}

  async getPublicKey(chainId: string): Promise<Uint8Array> {
    return this.requestViaProxy("getPublicKey", [chainId]);
  }

  async getSigningPublicKey(chainId: string): Promise<Uint8Array> {
    return this.requestViaProxy("getSigningPublicKey", [chainId]);
  }

  async encrypt(
    pubKey: Uint8Array,
    plainTextBytes: Uint8Array
  ): Promise<UmbralEncryptionResult> {
    return this.requestViaProxy("encrypt", [pubKey, plainTextBytes]);
  }

  async generateKeyFragments(
    chainId: string,
    receiverPublicKey: Uint8Array,
    threshold: number,
    shares: number
  ): Promise<UmbralKeyFragment[]> {
    return this.requestViaProxy("generateKeyFragments", [
      chainId,
      receiverPublicKey,
      threshold,
      shares,
    ]);
  }

  async decrypt(
    chainId: string,
    cipherTextBytes: Uint8Array
  ): Promise<Uint8Array> {
    return this.requestViaProxy("decrypt", [chainId, cipherTextBytes]);
  }

  async decryptReEncrypted(
    chainId: string,
    senderPublicKey: Uint8Array,
    capsule: Uint8Array,
    capsuleFragments: Uint8Array[],
    cipherTextBytes: Uint8Array
  ): Promise<Uint8Array> {
    return this.requestViaProxy("decryptReEncrypted", [
      chainId,
      senderPublicKey,
      capsule,
      capsuleFragments,
      cipherTextBytes,
    ]);
  }

  async verifyCapsuleFragment(
    capsuleFragment: Uint8Array,
    capsule: Uint8Array,
    verifyingPublicKey: Uint8Array,
    senderPublicKey: Uint8Array,
    receiverPublicKey: Uint8Array
  ): Promise<boolean> {
    return this.requestViaProxy("verifyCapsuleFragment", [
      capsuleFragment,
      capsule,
      verifyingPublicKey,
      senderPublicKey,
      receiverPublicKey,
    ]);
  }

  protected async requestViaProxy(
    method: UmbralMethod,
    args: any[]
  ): Promise<any> {
    const proxyRequest = createProxyRequest(`umbral.${method}`, args);

    return new Promise((resolve, reject) => {
      const messageHandler = (e: any) => {
        const proxyResponse = toProxyResponse(e.data);
        if (proxyResponse === undefined) {
          return;
        }

        this.proxy.removeMessageHandler(messageHandler);

        const result = JSONUint8Array.unwrap(proxyResponse.result);
        if (!result) {
          reject(new Error("Result is null"));
          return;
        }

        if (result.error) {
          reject(new Error(result.error));
          return;
        }

        resolve(result.return);
      };

      this.proxy.addMessageHandler(messageHandler);
      this.proxy.sendMessage(proxyRequest);
    });
  }
}

export class BrowserInjectedFetchWallet implements FetchBrowserWallet {
  readonly keplr: Keplr;
  readonly umbral: UmbralApi;
  readonly version: string;
  readonly wallet: WalletApi;

  constructor(keplr: Keplr, version: string) {
    this.keplr = keplr;
    this.version = version;
    this.umbral = new BrowserInjectedUmbral(createBrowserWindowProxy());
    this.wallet = new InjectedFetchWalletApi(
      new InjectedFetchNetworks(createBrowserWindowProxy()),
      new InjectedFetchAccount(createBrowserWindowProxy()),
      new InjectedFetchSigning(createBrowserWindowProxy()),
      new InjectedFetchAddressBook(createBrowserWindowProxy()),
      createBrowserWindowProxy()
    );
  }
}
