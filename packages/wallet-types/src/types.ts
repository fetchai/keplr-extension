import { Keplr } from "@keplr-wallet/types";
import { UmbralApi } from "@fetchai/umbral-types";
import {PublicKey} from "./public-keys";
import {NetworkConfig} from "./network-info";
import {OfflineSigner, TxsResponse} from "@cosmjs/launchpad";
import {OfflineDirectSigner} from "@cosmjs/proto-signing";

export interface Account {
    address: string
    publicKey: PublicKey
}

export interface Signature {
    readonly publicKey: PublicKey
    readonly signature: Uint8Array;
}

export interface NetworksApi {
    currentNetwork(): Promise<NetworkConfig | undefined>;
    switchToNetwork(network: NetworkConfig): Promise<void>;
    switchToNetworkByChainId(chainId: string): Promise<void>;
    listNetworks(): Promise<NetworkConfig[]>;
}

export interface AccountsApi {
    switchAccount(address: string): Promise<void>;
    listAccounts(): Promise<Account[]>;
    getAccount(chainId: string): Promise<Account>;
}

export interface AddressBookEntry {
    address: string;
    name: string;
    chainIds: string[];
}

export interface AddressBookApi {
    listEntries(): Promise<AddressBookEntry[]>;
    addEntry(entry: AddressBookEntry): Promise<void>;
    updateEntry(entry: AddressBookEntry): Promise<void>;
    deleteEntry(address: string): Promise<void>;
}

export interface EventHandler<T> {
    subscribe(handler: T): void;
    unsubscribe(handler: T): void;
}

export interface EventsApi {
    onStatusChanged: EventHandler<(status: WalletStatus) => void | Promise<void>>;
    onNetworkChanged: EventHandler<(network: NetworkConfig) => void | Promise<void>>;
    onAccountChanged: EventHandler<(account: Account) => void | Promise<void>>;
    onTxSuccessful: EventHandler<(tx: TxResponse) => void | Promise<void>>;
    onTxFailed: EventHandler<(tx: TxsResponse) => void | Promise<void>>;
}

export interface SigningApi {
    signArbitrary(
        chainId: string,
        signer: string,
        data: string | Uint8Array
    ): Promise<Signature>;

    verifyArbitrary(
        chainId: string,
        signer: string,
        data: string | Uint8Array,
        signature: Signature
    ): Promise<boolean>;

    getOfflineSigner(chainId: string): Promise<OfflineSigner | OfflineDirectSigner>;
    getOfflineDirectSigner(chainId: string): Promise<OfflineDirectSigner>;
    getOfflineAminoSigner(chainId: string): Promise<OfflineSigner>;
}

export type WalletStatus = "locked" | "unlocked";

export interface WalletApi {

    /**
     * WALLET STATUS API
     */

    /**
     * Determine the status of the wallet. It is either locked or unlocked
     */
    status(): Promise<WalletStatus>;

    /**
     * Allows the user to lock the wallet from the UI. This can implement logout like functionality
     */
    lockWallet(): Promise<void>;

    /**
     * Allows the dApp to
     */
    unlockWallet(): Promise<void>;

    /**
     * NETWORK SELECTION API
     */
    networks: NetworksApi;
    accounts: AccountsApi;
    addressBook: AddressBookApi;
    signing: SigningApi;
}


export interface FetchBrowserWallet {
  readonly version: string;
  readonly umbral: UmbralApi;
  readonly keplr: Keplr;
  readonly wallet: WalletApi;
}
