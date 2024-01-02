export type Method =
  | `umbral.${UmbralMethod}`
  | `wallet.${FetchWalletApiMethod}`;

export type FetchWalletApiMethod =
  | WalletMethod
  | `signing.${WalletSigningMethod}`
  | `networks.${NetworksApiMethod}`
  | `accounts.${AccountsApiMethod}`;

export type FetchWalletMethod =
  | WalletMethod
  | UmbralMethod
  | WalletSigningMethod
  | NetworksApiMethod
  | AccountsApiMethod;

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
