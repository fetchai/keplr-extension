import {
  ChainInfo,
  Keplr,
  Keplr as IKeplr,
  KeplrIntereactionOptions,
  KeplrMode,
  KeplrSignOptions,
  Key,
} from "@keplr-wallet/types";
import { Result, JSONUint8Array } from "@keplr-wallet/router";
import {
  BroadcastMode,
  AminoSignResponse,
  StdSignDoc,
  StdTx,
  OfflineSigner,
  StdSignature,
} from "@cosmjs/launchpad";
import { SecretUtils } from "secretjs/types/enigmautils";

import { KeplrEnigmaUtils } from "./enigma";
import { DirectSignResponse, OfflineDirectSigner } from "@cosmjs/proto-signing";

import {
  CosmJSFetchOfflineSigner,
  CosmJSFetchOfflineSignerOnlyAmino,
  CosmJSFetchOfflineSignerOnlyDirect,
  CosmJSOfflineSigner,
  CosmJSOfflineSignerOnlyAmino,
} from "./cosmjs";
import deepmerge from "deepmerge";
import Long from "long";
import {
  Account,
  AccountsApi,
  AddressBookApi,
  EventsApi,
  NetworksApi,
  Signature,
  SigningApi,
  WalletApi,
  WalletStatus,
} from "@fetchai/wallet-types";
import { NetworkConfig } from "@fetchai/wallet-types/build/network-info";
// import { PublicKey } from "@fetchai/wallet-types/build/public-keys";
// import { Bech32Address } from "@keplr-wallet/cosmos";
// import { OfflineDirectSigner } from "@cosmjs/proto-signing";
// import { OfflineSigner, StdSignDoc } from "@cosmjs/launchpad";
export interface ProxyRequest {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: keyof Keplr;
  args: any[];
}

export interface ProxyRequestWallet {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: keyof WalletApi;
  args: any[];
}

export interface ProxyRequestAccounts {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: keyof AccountsApi;
  args: any[];
}

export interface ProxyRequestWalletNetworks {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: keyof NetworksApi;
  args: any[];
}

export interface ProxyRequestWalletSigning {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: keyof SigningApi;
  args: any[];
}

export interface ProxyRequestResponse {
  type: "fetchai:proxy-request-response-v1";
  id: string;
  result: Result | undefined;
}

/**
 * InjectedKeplr would be injected to the webpage.
 * In the webpage, it can't request any messages to the extension because it doesn't have any API related to the extension.
 * So, to request some methods of the extension, this will proxy the request to the content script that is injected to webpage on the extension level.
 * This will use `window.postMessage` to interact with the content script.
 */
export class InjectedKeplr implements IKeplr {
  static startProxy(
    keplr: IKeplr,
    eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    parseMessage?: (message: any) => any
  ) {
    eventListener.addMessageListener(async (e: any) => {
      const message: ProxyRequest = parseMessage
        ? parseMessage(e.data)
        : e.data;
      if (!message || message.type !== "fetchai:proxy-request-v1") {
        return;
      }

      try {
        if (!message.id) {
          throw new Error("Empty id");
        }

        if (message.method === "version") {
          throw new Error("Version is not function");
        }

        if (message.method === "mode") {
          throw new Error("Mode is not function");
        }

        if (message.method === "defaultOptions") {
          throw new Error("DefaultOptions is not function");
        }

        if (
          !keplr[message.method] ||
          typeof keplr[message.method] !== "function"
        ) {
          throw new Error(`Invalid method: ${message.method}`);
        }

        if (message.method === "getOfflineSigner") {
          throw new Error("GetOfflineSigner method can't be proxy request");
        }

        if (message.method === "getOfflineSignerOnlyAmino") {
          throw new Error(
            "GetOfflineSignerOnlyAmino method can't be proxy request"
          );
        }

        if (message.method === "getOfflineSignerAuto") {
          throw new Error("GetOfflineSignerAuto method can't be proxy request");
        }

        if (message.method === "getEnigmaUtils") {
          throw new Error("GetEnigmaUtils method can't be proxy request");
        }

        const result =
          message.method === "signDirect"
            ? await (async () => {
                const receivedSignDoc: {
                  bodyBytes?: Uint8Array | null;
                  authInfoBytes?: Uint8Array | null;
                  chainId?: string | null;
                  accountNumber?: string | null;
                } = message.args[2];

                const result = await keplr.signDirect(
                  message.args[0],
                  message.args[1],
                  {
                    bodyBytes: receivedSignDoc.bodyBytes,
                    authInfoBytes: receivedSignDoc.authInfoBytes,
                    chainId: receivedSignDoc.chainId,
                    accountNumber: receivedSignDoc.accountNumber
                      ? Long.fromString(receivedSignDoc.accountNumber)
                      : null,
                  },
                  message.args[3]
                );

                return {
                  signed: {
                    bodyBytes: result.signed.bodyBytes,
                    authInfoBytes: result.signed.authInfoBytes,
                    chainId: result.signed.chainId,
                    accountNumber: result.signed.accountNumber.toString(),
                  },
                  signature: result.signature,
                };
              })()
            : await keplr[message.method](
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...JSONUint8Array.unwrap(message.args)
              );

        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            return: JSONUint8Array.wrap(result),
          },
        };

        eventListener.postMessage(proxyResponse);
      } catch (e: any) {
        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            error: e.message || e.toString(),
          },
        };

        eventListener.postMessage(proxyResponse);
      }
    });
  }

  protected requestMethod(method: keyof IKeplr, args: any[]): Promise<any> {
    const bytes = new Uint8Array(8);
    const id: string = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage: ProxyRequest = {
      type: "fetchai:proxy-request-v1",
      id,
      method,
      args: JSONUint8Array.wrap(args),
    };

    return new Promise((resolve, reject) => {
      const receiveResponse = (e: any) => {
        const proxyResponse: ProxyRequestResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;

        if (
          !proxyResponse ||
          proxyResponse.type !== "fetchai:proxy-request-response-v1"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }

        this.eventListener.removeMessageListener(receiveResponse);

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

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }

  protected enigmaUtils: Map<string, SecretUtils> = new Map();

  public defaultOptions: KeplrIntereactionOptions = {};

  constructor(
    public readonly version: string,
    public readonly mode: KeplrMode,
    protected readonly eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      removeMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      removeMessageListener: (fn: (e: any) => void) =>
        window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    protected readonly parseMessage?: (message: any) => any
  ) {}

  async enable(chainIds: string | string[]): Promise<void> {
    await this.requestMethod("enable", [chainIds]);
  }

  async experimentalSuggestChain(chainInfo: ChainInfo): Promise<void> {
    await this.requestMethod("experimentalSuggestChain", [chainInfo]);
  }

  async getKey(chainId: string): Promise<Key> {
    return await this.requestMethod("getKey", [chainId]);
  }

  async sendTx(
    chainId: string,
    tx: StdTx | Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array> {
    return await this.requestMethod("sendTx", [chainId, tx, mode]);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions: KeplrSignOptions = {}
  ): Promise<AminoSignResponse> {
    return await this.requestMethod("signAmino", [
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
    const result = await this.requestMethod("signDirect", [
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
    return await this.requestMethod("signArbitrary", [chainId, signer, data]);
  }

  async verifyArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array,
    signature: StdSignature
  ): Promise<boolean> {
    return await this.requestMethod("verifyArbitrary", [
      chainId,
      signer,
      data,
      signature,
    ]);
  }

  getOfflineSigner(chainId: string): OfflineSigner & OfflineDirectSigner {
    return new CosmJSOfflineSigner(chainId, this);
  }

  getOfflineSignerOnlyAmino(chainId: string): OfflineSigner {
    return new CosmJSOfflineSignerOnlyAmino(chainId, this);
  }

  async getOfflineSignerAuto(
    chainId: string
  ): Promise<OfflineSigner | OfflineDirectSigner> {
    const key = await this.getKey(chainId);
    if (key.isNanoLedger) {
      return new CosmJSOfflineSignerOnlyAmino(chainId, this);
    }
    return new CosmJSOfflineSigner(chainId, this);
  }

  async suggestToken(
    chainId: string,
    contractAddress: string,
    viewingKey?: string
  ): Promise<void> {
    return await this.requestMethod("suggestToken", [
      chainId,
      contractAddress,
      viewingKey,
    ]);
  }

  async getSecret20ViewingKey(
    chainId: string,
    contractAddress: string
  ): Promise<string> {
    return await this.requestMethod("getSecret20ViewingKey", [
      chainId,
      contractAddress,
    ]);
  }

  async getEnigmaPubKey(chainId: string): Promise<Uint8Array> {
    return await this.requestMethod("getEnigmaPubKey", [chainId]);
  }

  async getEnigmaTxEncryptionKey(
    chainId: string,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return await this.requestMethod("getEnigmaTxEncryptionKey", [
      chainId,
      nonce,
    ]);
  }

  async enigmaEncrypt(
    chainId: string,
    contractCodeHash: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg: object
  ): Promise<Uint8Array> {
    return await this.requestMethod("enigmaEncrypt", [
      chainId,
      contractCodeHash,
      msg,
    ]);
  }

  async enigmaDecrypt(
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return await this.requestMethod("enigmaDecrypt", [
      chainId,
      ciphertext,
      nonce,
    ]);
  }

  getEnigmaUtils(chainId: string): SecretUtils {
    if (this.enigmaUtils.has(chainId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.enigmaUtils.get(chainId)!;
    }

    const enigmaUtils = new KeplrEnigmaUtils(chainId, this);
    this.enigmaUtils.set(chainId, enigmaUtils);
    return enigmaUtils;
  }
}

export class FetchWalletApi implements WalletApi {
  static startProxy(
    wallet: WalletApi,
    eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    parseMessage?: (message: any) => any
  ) {
    eventListener.addMessageListener(async (e: any) => {
      const message: ProxyRequestWallet = parseMessage
        ? parseMessage(e.data)
        : e.data;
      if (!message || message.type !== "fetchai:proxy-request-v1") {
        return;
      }

      try {
        if (!message.id) {
          throw new Error("Empty id");
        }

        if (message.method === "networks") {
          throw new Error("networks is not function");
        }

        if (message.method === "accounts") {
          throw new Error("accounts is not function");
        }

        if (
          !wallet[message.method] ||
          typeof wallet[message.method] !== "function"
        ) {
          throw new Error(`Invalid method: ${message.method}`);
        }

        const result = await wallet[message.method](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(message.args)
        );

        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            return: JSONUint8Array.wrap(result),
          },
        };

        eventListener.postMessage(proxyResponse);
      } catch (e: any) {
        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            error: e.message || e.toString(),
          },
        };

        eventListener.postMessage(proxyResponse);
      }
    });
  }

  protected requestMethod(method: keyof WalletApi, args: any[]): Promise<any> {
    const bytes = new Uint8Array(8);
    const id: string = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage: ProxyRequestWallet = {
      type: "fetchai:proxy-request-v1",
      id,
      method,
      args: JSONUint8Array.wrap(args),
    };

    return new Promise((resolve, reject) => {
      const receiveResponse = (e: any) => {
        const proxyResponse: ProxyRequestResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;

        if (
          !proxyResponse ||
          proxyResponse.type !== "fetchai:proxy-request-response-v1"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }

        this.eventListener.removeMessageListener(receiveResponse);

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

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }

  public networks: NetworksApi;
  public accounts: AccountsApi;
  // public addressBook: AddressBookApi;
  public signing: SigningApi;
  // public events: EventsApi;

  constructor(
    protected readonly eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      removeMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      removeMessageListener: (fn: (e: any) => void) =>
        window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    protected readonly parseMessage?: (message: any) => any
  ) {
    this.networks = new FetchNetworks();
    this.accounts = new FetchAccount();
    this.signing = new FetchSigning();
    //  this.addressBook = new FetchAccount();
    //  this.events = new FetchAccount();
  }

  /* This method will work when connection is established
   * with wallet therefore wallet will always give status "unlocked"
   */
  async status(): Promise<WalletStatus> {
    return await this.requestMethod("status", []);
  }

  async unlockWallet(): Promise<void> {
    await this.requestMethod("unlockWallet", []);
  }

  async lockWallet(): Promise<void> {
    await this.requestMethod("lockWallet", []);
  }
}

export class FetchAccount implements AccountsApi {
  static startProxy(
    accountsApi: AccountsApi,
    eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    parseMessage?: (message: any) => any
  ) {
    eventListener.addMessageListener(async (e: any) => {
      const message: ProxyRequestAccounts = parseMessage
        ? parseMessage(e.data)
        : e.data;
      if (!message || message.type !== "fetchai:proxy-request-v1") {
        return;
      }

      try {
        if (!message.id) {
          throw new Error("Empty id");
        }

        if (
          !accountsApi[message.method] ||
          typeof accountsApi[message.method] !== "function"
        ) {
          throw new Error(`Invalid method: ${message.method}`);
        }

        const result = await accountsApi[message.method](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(message.args)
        );

        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            return: JSONUint8Array.wrap(result),
          },
        };

        eventListener.postMessage(proxyResponse);
      } catch (e: any) {
        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            error: e.message || e.toString(),
          },
        };

        eventListener.postMessage(proxyResponse);
      }
    });
  }

  protected requestMethod(
    method: keyof AccountsApi,
    args: any[]
  ): Promise<any> {
    const bytes = new Uint8Array(8);
    const id: string = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage: ProxyRequestAccounts = {
      type: "fetchai:proxy-request-v1",
      id,
      method,
      args: JSONUint8Array.wrap(args),
    };

    return new Promise((resolve, reject) => {
      const receiveResponse = (e: any) => {
        const proxyResponse: ProxyRequestResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;

        if (
          !proxyResponse ||
          proxyResponse.type !== "fetchai:proxy-request-response-v1"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }

        this.eventListener.removeMessageListener(receiveResponse);

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

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }

  constructor(
    protected readonly eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      removeMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      removeMessageListener: (fn: (e: any) => void) =>
        window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    protected readonly parseMessage?: (message: any) => any
  ) {}

  /* This method will work when connection is established
   * with wallet therefore wallet will always give status "unlocked"
   */
  async currentAccount(): Promise<Account> {
    return await this.requestMethod("currentAccount", []);
  }

  async switchAccount(address: string): Promise<void> {
    await this.requestMethod("switchAccount", [address]);
  }

  async listAccounts(): Promise<Account[]> {
    return await this.requestMethod("listAccounts", []);
  }

  async getAccount(): Promise<Account> {
    return await this.requestMethod("getAccount", []);
  }
}

class FetchNetworks implements NetworksApi {
  static startProxy(
    networksApi: NetworksApi,
    eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    parseMessage?: (message: any) => any
  ) {
    eventListener.addMessageListener(async (e: any) => {
      const message: ProxyRequestWalletNetworks = parseMessage
        ? parseMessage(e.data)
        : e.data;
      if (!message || message.type !== "fetchai:proxy-request-v1") {
        return;
      }

      try {
        if (!message.id) {
          throw new Error("Empty id");
        }

        if (
          !networksApi[message.method] ||
          typeof networksApi[message.method] !== "function"
        ) {
          throw new Error(`Invalid method: ${message.method}`);
        }

        const result = await networksApi[message.method](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(message.args)
        );

        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            return: JSONUint8Array.wrap(result),
          },
        };

        eventListener.postMessage(proxyResponse);
      } catch (e: any) {
        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            error: e.message || e.toString(),
          },
        };

        eventListener.postMessage(proxyResponse);
      }
    });
  }

  protected requestMethod(
    method: keyof NetworksApi,
    args: any[]
  ): Promise<any> {
    const bytes = new Uint8Array(8);
    const id: string = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage: ProxyRequestWalletNetworks = {
      type: "fetchai:proxy-request-v1",
      id,
      method,
      args: JSONUint8Array.wrap(args),
    };

    return new Promise((resolve, reject) => {
      const receiveResponse = (e: any) => {
        const proxyResponse: ProxyRequestResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;

        if (
          !proxyResponse ||
          proxyResponse.type !== "fetchai:proxy-request-response-v1"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }

        this.eventListener.removeMessageListener(receiveResponse);

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

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }

  constructor(
    protected readonly eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      removeMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      removeMessageListener: (fn: (e: any) => void) =>
        window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    protected readonly parseMessage?: (message: any) => any
  ) {}

  async currentNetwork(): Promise<NetworkConfig> {
    return await this.requestMethod("currentNetwork", []);
  }

  async switchToNetwork(network: NetworkConfig): Promise<void> {
    console.log("switchToNetwork ", network);
  }

  async switchToNetworkByChainId(chainId: string): Promise<void> {
    console.log("switchToNetworkByChainId ", chainId);
  }

  async listNetworks(): Promise<NetworkConfig[]> {
    return await this.requestMethod("listNetworks", []);
  }
}

class FetchSigning implements SigningApi {
  static startProxy(
    signingApi: SigningApi,
    eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    parseMessage?: (message: any) => any
  ) {
    eventListener.addMessageListener(async (e: any) => {
      const message: ProxyRequestWalletSigning = parseMessage
        ? parseMessage(e.data)
        : e.data;
      if (!message || message.type !== "fetchai:proxy-request-v1") {
        return;
      }

      try {
        if (!message.id) {
          throw new Error("Empty id");
        }

        if (
          !signingApi[message.method] ||
          typeof signingApi[message.method] !== "function"
        ) {
          throw new Error(`Invalid method: ${message.method}`);
        }

        const result = await signingApi[message.method](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(message.args)
        );

        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            return: JSONUint8Array.wrap(result),
          },
        };

        eventListener.postMessage(proxyResponse);
      } catch (e: any) {
        const proxyResponse: ProxyRequestResponse = {
          type: "fetchai:proxy-request-response-v1",
          id: message.id,
          result: {
            error: e.message || e.toString(),
          },
        };

        eventListener.postMessage(proxyResponse);
      }
    });
  }

  protected requestMethod(method: keyof SigningApi, args: any[]): Promise<any> {
    const bytes = new Uint8Array(8);
    const id: string = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage: ProxyRequestWalletSigning = {
      type: "fetchai:proxy-request-v1",
      id,
      method,
      args: JSONUint8Array.wrap(args),
    };

    return new Promise((resolve, reject) => {
      const receiveResponse = (e: any) => {
        const proxyResponse: ProxyRequestResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;

        if (
          !proxyResponse ||
          proxyResponse.type !== "fetchai:proxy-request-response-v1"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }

        this.eventListener.removeMessageListener(receiveResponse);

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

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }

  public defaultOptions: KeplrIntereactionOptions = {};

  constructor(
    protected readonly eventListener: {
      addMessageListener: (fn: (e: any) => void) => void;
      removeMessageListener: (fn: (e: any) => void) => void;
      postMessage: (message: any) => void;
    } = {
      addMessageListener: (fn: (e: any) => void) =>
        window.addEventListener("message", fn),
      removeMessageListener: (fn: (e: any) => void) =>
        window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    },
    protected readonly parseMessage?: (message: any) => any
  ) {}

  async getKey(chainId: string): Promise<Key> {
    return await this.requestMethod("getKey", [chainId]);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: KeplrSignOptions
  ): Promise<AminoSignResponse> {
    return await this.requestMethod("signAmino", [
      chainId,
      signer,
      signDoc,
      // deepmerge(this.defaultOptions.sign ?? {}, signOptions),
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
    const result = await this.requestMethod("signDirect", [
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
  ): Promise<Signature> {
    return await this.requestMethod("signArbitrary", [chainId, signer, data]);
  }

  async verifyArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array,
    signature: Signature
  ): Promise<boolean> {
    return await this.requestMethod("verifyArbitrary", [
      chainId,
      signer,
      data,
      signature,
    ]);
  }

  async getOfflineSigner(
    chainId: string
  ): Promise<OfflineDirectSigner | OfflineSigner> {
    return new CosmJSFetchOfflineSigner(chainId, this);
  }

  async getOfflineDirectSigner(chainId: string): Promise<OfflineDirectSigner> {
    return new CosmJSFetchOfflineSignerOnlyDirect(chainId, this);
  }

  async getOfflineAminoSigner(chainId: string): Promise<OfflineSigner> {
    return new CosmJSFetchOfflineSignerOnlyAmino(chainId, this);
  }
}
