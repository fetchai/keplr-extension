export type Method =
  | `umbral.${UmbralMethod}`
  | `wallet.${FetchWalletApiMethod}`;

export type FetchWalletApiMethod =
  | WalletMethod
  | `signing.${WalletSigningMethod}`
  | `networks.${NetworksApiMethod}`
  | `accounts.${AccountsApiMethod}`
  | `events.${EventsApiSubMethod}`;

export type FetchWalletMethod =
  | WalletMethod
  | UmbralMethod
  | WalletSigningMethod
  | NetworksApiMethod
  | AccountsApiMethod
  | EventsApiSubMethod;

export type UmbralMethod =
  | "getPublicKey"
  | "getSigningPublicKey"
  | "encrypt"
  | "generateKeyFragments"
  | "decrypt"
  | "decryptReEncrypted"
  | "verifyCapsuleFragment";

export type WalletSigningMethod =
  | "getCurrentKey"
  | "signAmino"
  | "signDirect"
  | "signArbitrary"
  | "verifyArbitrary"
  | "getOfflineSigner"
  | "getOfflineDirectSigner"
  | "getOfflineAminoSigner";

export type WalletMethod = "status" | "lockWallet" | "unlockWallet";

export type NetworksApiMethod =
  | "getNetwork"
  | "switchToNetwork"
  | "switchToNetworkByChainId"
  | "listNetworks";

export type AccountsApiMethod =
  | "currentAccount"
  | "switchAccount"
  | "listAccounts"
  | "getAccount";

export type EventsApiSubMethod =
  | "onStatusChanged.subscribe"
  | "onStatusChanged.unsubscribe"
  | "onAccountChanged.subscribe"
  | "onAccountChanged.unsubscribe"
  | "onNetworkChanged.subscribe"
  | "onNetworkChanged.unsubscribe"
  | "onTxSuccessful.subscribe"
  | "onTxSuccessful.unsubscribe"
  | "onTxFailed.subscribe"
  | "onTxFailed.unsubscribe"
  | "onEVMTxSuccessful.subscribe"
  | "onEVMTxSuccessful.unsubscribe"
  | "onEVMTxFailed.subscribe"
  | "onEVMTxFailed.unsubscribe";

export type EventsApiMethod =
  | "onStatusChanged"
  | "onAccountChanged"
  | "onNetworkChanged"
  | "onTxFailed"
  | "onTxSuccessful"
  | "onEVMTxSuccessful"
  | "onEVMTxFailed";
