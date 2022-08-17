import { Keplr } from "@keplr-wallet/types";
import { UmbralApi } from "@fetchai/umbral-types";
import { PublicKey } from "./public-keys";
import { NetworkConfig } from "./network-info";
import { OfflineSigner, TxsResponse } from "@cosmjs/launchpad";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

/**
 * The representation of the Account
 */
export interface Account {
  /**
   * The address of the account
   */
  readonly address: string;

  /**
   * The public key of the account
   */
  readonly publicKey: PublicKey;
}

/**
 * A representation of a Signature
 */
export interface Signature {
  /**
   * The message data that was signed
   */
  readonly messageData: Uint8Array;

  /**
   * The public key that was used to sign  the message
   */
  readonly publicKey: PublicKey;

  /**
   * The signature that was generated from the signing process
   */
  readonly signature: Uint8Array;
}

/**
 * The Networks API allows users to control which network the Fetch Wallet
 */
export interface NetworksApi {
  /**
   * The current network that the Fetch Wallet is targeting
   *
   * @throws An error if the wallet is locked or if the dApp does not have permission to the networks API
   */
  currentNetwork(): Promise<NetworkConfig>;

  /**
   * Switch a specified network
   *
   * @param network The new network to target the Wallet at.
   * @throws An error if the dApp does not have permission to the networks API
   */
  switchToNetwork(network: NetworkConfig): Promise<void>;

  /**
   * Switch to a previous network by chain id
   *
   * @param chainId The chain id of the new network to target
   * @throws An error if the dApp does not have permission to the networks API
   */
  switchToNetworkByChainId(chainId: string): Promise<void>;

  /**
   * List all the currently known networks in the wallet
   *
   * @throws An error if the dApp does not have permission to the networks API
   */
  listNetworks(): Promise<NetworkConfig[]>;
}

/**
 * The accounts API controls access to the private / public key pairs which are controlled by the browser wallet.
 */
export interface AccountsApi {
  /**
   * Get the currently selected account in the wallet
   *
   * @return the currently selected account
   * @throws An error if the wallet is locked or the dApp does not have permission to access the Accounts API
   */
  currentAccount(): Promise<Account>;

  /**
   * Change the current active account to the address specified
   *
   * @param address The address to switch to
   * @throws An error if the wallet is locked or the dApp does not have permission to access the Accounts API
   */
  switchAccount(address: string): Promise<void>;

  /**
   * Allows the user to be list the available accounts for the selected network
   *
   * @returns The list of accounts
   * @throws An error if the wallet is locked or the dApp does not have permission to access the Accounts API
   */
  listAccounts(): Promise<Account[]>;

  /**
   * Allows the user to look up a specific account
   *
   * @param address The address of the account to lookup
   * @returns The account object on a successful lookup
   * @throws An error if the account can't be found, the wallet is locked or the dApp does not have permission to access
   * the Accounts API
   */
  getAccount(address: string): Promise<Account>;
}

/**
 * The API definition of an address book entry
 */
export interface AddressBookEntry {
  /**
   * The wallet address.
   *
   * The representation is chain specific. For example in the case of the Fetch chain it should be bech32 encoded and
   * should have the prefix `fetch`
   */
  address: string;

  /**
   * The human-readable name associated with the address
   */
  name: string;

  /**
   * A set of chain IDs to which this address book entry is applicable
   */
  chainIds: string[];
}

/**
 * The address book API is a feature that the user can optionally allow dApps access to.
 */
export interface AddressBookApi {
  /**
   * Get all the address book entries
   *
   * @returns The list of address book entries that are stored in the wallet
   *
   * @throws An error if the wallet is locked or if dApp does not have permission to access the address book
   */
  listEntries(): Promise<AddressBookEntry[]>;

  /**
   * Adds an address book entry to the wallet
   *
   * @param entry The entry to be added
   *
   * @throws An error if hte entry address already exists in the address book, or if the dApp does not have permission
   * to access the address book
   */
  addEntry(entry: AddressBookEntry): Promise<void>;

  /**
   * Updates an existing address book entry to the wallet
   *
   * @param entry The entry to be updated
   *
   * @throws An error if the existing entry can not be found in the address book, or if the dApp does not have permission
   * to access the address book
   */
  updateEntry(entry: AddressBookEntry): Promise<void>;

  /**
   * Deletes a specified address from the address book
   *
   * @param address The address to be removed from the wallet
   *
   * @throws An error if the address does not match an entry in the address book, or if the dApp does not have permission
   * to access the address book
   */
  deleteEntry(address: string): Promise<void>;
}

/**
 * The EventHandler specifies an interface that allows users to subscribe to specific set of events
 */
export interface EventHandler<T> {
  /**
   * Subscribe to events
   *
   * @param handler The handler that should be called when a new event is generated
   */
  subscribe(handler: T): void;

  /**
   * Unsubscribe from events
   *
   * @param handler The handler function that should unsubscribe
   */
  unsubscribe(handler: T): void;
}

interface TxResponse {
  // TODO(EJF)
}

/**
 * The Events API
 *
 * This allows dApp developers to subscribe to wallet events in order to dynamically track wallet state updated
 */
export interface EventsApi {
  /**
   * The event handler for the status update changes i.e. locked vs unlocked
   */
  onStatusChanged: EventHandler<(status: WalletStatus) => void | Promise<void>>;

  /**
   * The event handler for the network updates and changes.
   *
   * When the wallet is unlocked it will fire a network changed event
   */
  onNetworkChanged: EventHandler<
    (network: NetworkConfig) => void | Promise<void>
  >;

  /**
   * The event handler for the account updates and changes
   *
   * When the wallet is unlocked it will fire a account changed event
   */
  onAccountChanged: EventHandler<(account: Account) => void | Promise<void>>;

  /**
   * The event handler for successful transaction events
   */
  onTxSuccessful: EventHandler<(tx: TxResponse) => void | Promise<void>>;

  /**
   * The event handler for unsuccessful transaction events
   */
  onTxFailed: EventHandler<(tx: TxsResponse) => void | Promise<void>>;
}

/**
 * The signing API is used be dApp developers to be able to sign transactions and other interactions with the network
 *
 * By design, we expect most users to build and sign transactions by using CosmJS. By comparison with the original
 * Keplr we do not allow other signing messages
 */
export interface SigningApi {
  /**
   * Signs arbitrary data
   *
   * This API can be very useful when authenticating users by their wallet address
   *
   * @param chainId The target chain id
   * @param signer The target signer
   * @param data The data that should have been signed
   * @returns A signature object that can be verified
   */
  signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<Signature>;

  /**
   * Verifies a signature made via the `signArbitrary` API
   *
   * @param chainId The target chain id
   * @param signer The target signer
   * @param data The data that should have been signed
   * @param signature The signature to verify
   * @returns True if the signature is verified, otherwise false.
   */
  verifyArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array,
    signature: Signature
  ): Promise<boolean>;

  /**
   * Get a signer capable of either Direct or Amino signing methods.
   *
   * In the case that the underlying signer can support both, the direct signer will be used by default (since it is
   * newer).
   *
   * @param chainId The targeted chain id
   * @returns An CosmJS compatible signer
   */
  getOfflineSigner(
    chainId: string
  ): Promise<OfflineDirectSigner | OfflineSigner>;

  /**
   * Get a signer that supports Direct only signing methods
   *
   * @param chainId The target chain id
   * @returns A CosmJS compatible signer
   */
  getOfflineDirectSigner(chainId: string): Promise<OfflineDirectSigner>;

  /**
   * Get a signer that supports Amino only signing methods.
   *
   * @param chainId The target chain id
   * @returns A CosmJS compatible signer
   */
  getOfflineAminoSigner(chainId: string): Promise<OfflineSigner>;

  // TODO(EJF): Need to add methods for BLS aggregated signatures
}

/**
 * The status of the wallet.
 */
export type WalletStatus = "locked" | "unlocked";

/**
 * The WalletAPI
 *
 * The main goal of the wallet api is to provide a good interface for dApp builders in order to build compelling
 * interfaces.
 *
 * The interface is designed to be extended over time.
 */
export interface WalletApi {
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
   * The networks API
   */
  networks: NetworksApi;

  /**
   * The accounts API
   */
  accounts: AccountsApi;

  /**
   * The address book API
   */
  addressBook: AddressBookApi;

  /**
   * The signing API
   */
  signing: SigningApi;

  /**
   * The events API
   */
  events: EventsApi;
}

/**
 * The main browser wallet extension API
 *
 * Typically, injected into window.fetchBrowserWallet
 */
export interface FetchBrowserWallet {
  /**
   * The version of the installed browser wallet extension
   */
  readonly version: string;

  /**
   * The Umbral Api
   *
   * Allows users to interact with the Proxy Re-encryption API
   */
  readonly umbral: UmbralApi;

  /**
   * The main Wallet API
   *
   * Allows users to interact with the Fetch Network
   */
  readonly wallet: WalletApi;

  /**
   * @deprecated Legacy Keplr API
   */
  readonly keplr: Keplr;
}
