import {
  Account,
  AccountsApi,
  NetworksApi,
  SigningApi,
  WalletApi,
  WalletStatus,
} from "@fetchai/wallet-types";
import {
  AminoSignResponse,
  ChainInfo,
  DirectSignResponse,
  KeplrIntereactionOptions,
  KeplrSignOptions,
  Key,
  OfflineAminoSigner,
  OfflineDirectSigner,
  StdSignDoc,
  StdSignature,
} from "@keplr-wallet/types";
import deepmerge from "deepmerge";
import Long from "long";
import {
  CosmJSFetchOfflineSigner,
  CosmJSFetchOfflineSignerOnlyAmino,
  CosmJSFetchOfflineSignerOnlyDirect,
} from "../cosmjs";
import { Proxy, createProxyRequest, toProxyResponse } from "./proxy";
import { JSONUint8Array } from "@keplr-wallet/router";
import {
  AccountsApiMethod,
  NetworksApiMethod,
  WalletSigningMethod,
  WalletMethod,
} from "./types";

export class InjectedFetchWalletApi implements WalletApi {
  constructor(
    public networks: NetworksApi,
    public accounts: AccountsApi,
    public signing: SigningApi,
    protected readonly proxy: Proxy
  ) {}

  async status(): Promise<WalletStatus> {
    return await this.requestViaProxy("status", []);
  }

  async unlockWallet(password: string): Promise<void> {
    await this.requestViaProxy("lockWallet", [password]);
  }

  async lockWallet(): Promise<void> {
    await this.requestViaProxy("unlockWallet", []);
  }

  protected async requestViaProxy(
    method: WalletMethod,
    args: any[]
  ): Promise<any> {
    const proxyRequest = createProxyRequest(`wallet.${method}`, args);

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

export class InjectedFetchAccount implements AccountsApi {
  constructor(protected readonly proxy: Proxy) {}

  /* This method will work when connection is established
   * with wallet therefore wallet will always give status "unlocked"
   */
  async currentAccount(chainId: string): Promise<Account> {
    return await this.requestViaProxy("currentAccount", [chainId]);
  }

  async switchAccount(address: string): Promise<void> {
    await this.requestViaProxy("switchAccount", [address]);
  }

  async listAccounts(): Promise<Account[]> {
    return await this.requestViaProxy("listAccounts", []);
  }

  async getAccount(address: string): Promise<Account> {
    return await this.requestViaProxy("getAccount", [address]);
  }

  protected async requestViaProxy(
    method: AccountsApiMethod,
    args: any[]
  ): Promise<any> {
    const proxyRequest = createProxyRequest(`wallet.accounts.${method}`, args);

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

export class InjectedFetchNetworks implements NetworksApi {
  constructor(protected readonly proxy: Proxy) {}

  async getNetwork(): Promise<ChainInfo> {
    return await this.requestViaProxy("getNetwork", []);
  }

  async switchToNetwork(network: ChainInfo): Promise<void> {
    return await this.requestViaProxy("switchToNetwork", [network]);
  }

  async switchToNetworkByChainId(chainId: string): Promise<void> {
    return await this.requestViaProxy("switchToNetworkByChainId", [chainId]);
  }

  async listNetworks(): Promise<ChainInfo[]> {
    return await this.requestViaProxy("listNetworks", []);
  }

  protected async requestViaProxy(
    method: NetworksApiMethod,
    args: any[]
  ): Promise<any> {
    const proxyRequest = createProxyRequest(`wallet.networks.${method}`, args);

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

export class InjectedFetchSigning implements SigningApi {
  constructor(protected readonly proxy: Proxy) {}

  public defaultOptions: KeplrIntereactionOptions = {};

  async getCurrentKey(chainId: string): Promise<Key> {
    const k = await this.requestViaProxy("getCurrentKey", [chainId]);
    return k;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions: KeplrSignOptions = {}
  ): Promise<AminoSignResponse> {
    return await this.requestViaProxy("signAmino", [
      chainId,
      signer,
      signDoc,
      deepmerge(this.defaultOptions.sign ?? {}, signOptions),
    ]);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      bodyBytes?: Uint8Array | null;
      authInfoBytes?: Uint8Array | null;
      chainId?: string | null;
      accountNumber?: Long | null;
    },
    signOptions: KeplrSignOptions = {}
  ): Promise<DirectSignResponse> {
    const result = await this.requestViaProxy("signDirect", [
      chainId,
      signer,
      // We can't send the `Long` with remaing the type.
      // Receiver should change the `string` to `Long`.
      {
        bodyBytes: signDoc.bodyBytes,
        authInfoBytes: signDoc.authInfoBytes,
        chainId: signDoc.chainId,
        accountNumber: signDoc.accountNumber
          ? signDoc.accountNumber.toString()
          : null,
      },
      deepmerge(this.defaultOptions.sign ?? {}, signOptions),
    ]);

    const signed: {
      bodyBytes: Uint8Array;
      authInfoBytes: Uint8Array;
      chainId: string;
      accountNumber: string;
    } = result.signed;

    return {
      signed: {
        bodyBytes: signed.bodyBytes,
        authInfoBytes: signed.authInfoBytes,
        chainId: signed.chainId,
        // We can't send the `Long` with remaing the type.
        // Sender should change the `Long` to `string`.
        accountNumber: Long.fromString(signed.accountNumber),
      },
      signature: result.signature,
    };
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return await this.requestViaProxy("signArbitrary", [chainId, signer, data]);
  }

  async verifyArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array,
    signature: StdSignature
  ): Promise<boolean> {
    return await this.requestViaProxy("verifyArbitrary", [
      chainId,
      signer,
      data,
      signature,
    ]);
  }

  async getOfflineSigner(
    chainId: string
  ): Promise<OfflineDirectSigner | OfflineAminoSigner> {
    return new CosmJSFetchOfflineSigner(chainId, this);
  }

  async getOfflineDirectSigner(chainId: string): Promise<OfflineDirectSigner> {
    return new CosmJSFetchOfflineSignerOnlyDirect(chainId, this);
  }

  async getOfflineAminoSigner(chainId: string): Promise<OfflineAminoSigner> {
    return new CosmJSFetchOfflineSignerOnlyAmino(chainId, this);
  }

  protected async requestViaProxy(
    method: WalletSigningMethod,
    args: any[]
  ): Promise<any> {
    const proxyRequest = createProxyRequest(`wallet.signing.${method}`, args);

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
