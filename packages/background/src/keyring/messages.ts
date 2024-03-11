import { Message } from "@keplr-wallet/router";
import { ROUTE } from "./constants";
import {
  KeyRing,
  KeyRingStatus,
  MultiKeyStoreInfoWithSelected,
} from "./keyring";
import { BIP44HDPath, ExportKeyRingData } from "./types";
import { Account, WalletStatus } from "@fetchai/wallet-types";

import {
  Bech32Address,
  checkAndValidateADR36AminoSignDoc,
  EthermintChainIdHelper,
} from "@keplr-wallet/cosmos";
import {
  BIP44,
  EthSignType,
  KeplrSignOptions,
  Key,
  StdSignDoc,
  AminoSignResponse,
  StdSignature,
} from "@keplr-wallet/types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require("bip39");
import { SignDoc } from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import { Buffer } from "buffer/";
import { LedgerApp } from "../ledger";
import { BigNumber } from "@ethersproject/bignumber";

export class RestoreKeyRingMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "restore-keyring";
  }

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {}

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RestoreKeyRingMsg.type();
  }
}

export class DeleteKeyRingMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "delete-keyring";
  }

  constructor(public readonly index: number, public readonly password: string) {
    super();
  }

  validateBasic(): void {
    if (!Number.isInteger(this.index)) {
      throw new Error("Invalid index");
    }

    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return DeleteKeyRingMsg.type();
  }
}

export class UpdateNameKeyRingMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "update-name-keyring";
  }

  constructor(public readonly index: number, public readonly name: string) {
    super();
  }

  validateBasic(): void {
    if (!Number.isInteger(this.index)) {
      throw new Error("Invalid index");
    }

    if (!this.name) {
      throw new Error("name not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return UpdateNameKeyRingMsg.type();
  }
}

export class ShowKeyRingMsg extends Message<string> {
  public static type() {
    return "show-keyring";
  }

  constructor(public readonly index: number, public readonly password: string) {
    super();
  }

  validateBasic(): void {
    if (!Number.isInteger(this.index)) {
      throw new Error("Invalid index");
    }

    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ShowKeyRingMsg.type();
  }
}

export class CreateMnemonicKeyMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "create-mnemonic-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly mnemonic: string,
    public readonly password: string,
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.mnemonic) {
      throw new Error("mnemonic not set");
    }

    if (!this.password) {
      throw new Error("password not set");
    }

    // Validate mnemonic.
    // Checksome is not validate in this method.
    // Keeper should handle the case of invalid checksome.
    try {
      bip39.mnemonicToEntropy(this.mnemonic);
    } catch (e) {
      if (e.message !== "Invalid mnemonic checksum") {
        throw e;
      }
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreateMnemonicKeyMsg.type();
  }
}

export class AddMnemonicKeyMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "add-mnemonic-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly mnemonic: string,
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.mnemonic) {
      throw new Error("mnemonic not set");
    }

    // Validate mnemonic.
    // Checksome is not validate in this method.
    // Keeper should handle the case of invalid checksome.
    try {
      bip39.mnemonicToEntropy(this.mnemonic);
    } catch (e) {
      if (e.message !== "Invalid mnemonic checksum") {
        throw e;
      }
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return AddMnemonicKeyMsg.type();
  }
}

export class CreatePrivateKeyMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "create-private-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly privateKey: Uint8Array,
    public readonly password: string,
    public readonly meta: Record<string, string>
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.privateKey || this.privateKey.length === 0) {
      throw new Error("private key not set");
    }

    if (this.privateKey.length !== 32) {
      throw new Error("invalid length of private key");
    }

    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreatePrivateKeyMsg.type();
  }
}

export class CreateKeystoneKeyMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "create-keystone-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly password: string,
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.password) {
      throw new Error("password not set");
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreateKeystoneKeyMsg.type();
  }
}

export class CreateLedgerKeyMsg extends Message<{
  status: KeyRingStatus;
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "create-ledger-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly password: string,
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath,
    public readonly cosmosLikeApp?: string
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.password) {
      throw new Error("password not set");
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CreateLedgerKeyMsg.type();
  }
}

export class AddPrivateKeyMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "add-private-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly privateKey: Uint8Array,
    public readonly meta: Record<string, string>
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    if (!this.privateKey || this.privateKey.length === 0) {
      throw new Error("private key not set");
    }

    if (this.privateKey.length !== 32) {
      throw new Error("invalid length of private key");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return AddPrivateKeyMsg.type();
  }
}

export class AddKeystoneKeyMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "add-keystone-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return AddKeystoneKeyMsg.type();
  }
}

export class AddLedgerKeyMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "add-ledger-key";
  }

  constructor(
    public readonly kdf: "scrypt" | "sha256" | "pbkdf2",
    public readonly meta: Record<string, string>,
    public readonly bip44HDPath: BIP44HDPath,
    public readonly cosmosLikeApp?: string
  ) {
    super();
  }

  validateBasic(): void {
    if (
      this.kdf !== "scrypt" &&
      this.kdf !== "sha256" &&
      this.kdf !== "pbkdf2"
    ) {
      throw new Error("Invalid kdf");
    }

    KeyRing.validateBIP44Path(this.bip44HDPath);
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return AddLedgerKeyMsg.type();
  }
}

export class LockKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "lock-keyring";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return LockKeyRingMsg.type();
  }
}

export class UnlockKeyRingMsg extends Message<{ status: KeyRingStatus }> {
  public static type() {
    return "unlock-keyring";
  }

  constructor(public readonly password = "") {
    super();
  }

  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return UnlockKeyRingMsg.type();
  }
}

export class GetKeyMsg extends Message<Key> {
  public static type() {
    return "get-key";
  }

  constructor(public readonly chainId: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetKeyMsg.type();
  }
}

export class RequestSignAminoMsg extends Message<AminoSignResponse> {
  public static type() {
    return "request-sign-amino";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDoc: StdSignDoc,
    public readonly signOptions: KeplrSignOptions & {
      // Hack option field to detect the sign arbitrary for string
      isADR36WithString?: boolean;
      ethSignType?: EthSignType;
    } = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.signer);

    // Check and validate the ADR-36 sign doc.
    // ADR-36 sign doc doesn't have the chain id
    if (!checkAndValidateADR36AminoSignDoc(this.signDoc)) {
      if (this.signOptions.ethSignType) {
        throw new Error(
          "Eth sign type can be requested with only ADR-36 amino sign doc"
        );
      }

      if (this.signDoc.chain_id !== this.chainId) {
        throw new Error(
          "Chain id in the message is not matched with the requested chain id"
        );
      }
    } else {
      if (this.signDoc.msgs[0].value.signer !== this.signer) {
        throw new Error("Unmatched signer in sign doc");
      }

      if (this.signOptions.ethSignType) {
        switch (this.signOptions.ethSignType) {
          // TODO: Check chain id in tx data.
          // case EthSignType.TRANSACTION:
          case EthSignType.EIP712: {
            const message = JSON.parse(
              Buffer.from(this.signDoc.msgs[0].value.data, "base64").toString()
            );
            const { ethChainId } = EthermintChainIdHelper.parse(this.chainId);
            if (parseFloat(message.domain?.chainId) !== ethChainId) {
              throw new Error(
                `Unmatched chain id for eth (expected: ${ethChainId}, actual: ${message.domain?.chainId})`
              );
            }
          }
          // XXX: There is no way to check chain id if type is message because eth personal sign standard doesn't define chain id field.
          // case EthSignType.MESSAGE:
        }
      }
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestSignAminoMsg.type();
  }
}

export class RequestSignEIP712CosmosTxMsg_v0 extends Message<AminoSignResponse> {
  public static type() {
    return "request-sign-eip-712-cosmos-tx-v0";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly eip712: {
      types: Record<string, { name: string; type: string }[] | undefined>;
      domain: Record<string, any>;
      primaryType: string;
    },
    public readonly signDoc: StdSignDoc,
    public readonly signOptions: KeplrSignOptions
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.signer);

    // Check and validate the ADR-36 sign doc.
    // ADR-36 sign doc doesn't have the chain id
    if (!checkAndValidateADR36AminoSignDoc(this.signDoc)) {
      if (this.signDoc.chain_id !== this.chainId) {
        throw new Error(
          "Chain id in the message is not matched with the requested chain id"
        );
      }

      const { ethChainId } = EthermintChainIdHelper.parse(this.chainId);

      if (!BigNumber.from(this.eip712.domain["chainId"]).eq(ethChainId)) {
        throw new Error(
          `Unmatched chain id for eth (expected: ${ethChainId}, actual: ${this.eip712.domain["chainId"]})`
        );
      }
    } else {
      throw new Error("Can't sign ADR-36 with EIP-712");
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestSignEIP712CosmosTxMsg_v0.type();
  }
}

export class RequestICNSAdr36SignaturesMsg extends Message<
  {
    chainId: string;
    bech32Prefix: string;
    bech32Address: string;
    addressHash: "cosmos" | "ethereum";
    pubKey: Uint8Array;
    signatureSalt: number;
    signature: Uint8Array;
  }[]
> {
  public static type() {
    return "request-icns-adr-36-signatures";
  }

  constructor(
    readonly chainId: string,
    readonly contractAddress: string,
    readonly owner: string,
    readonly username: string,
    readonly addressChainIds: string[]
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.contractAddress) {
      throw new Error("contract address not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.contractAddress);

    if (!this.owner) {
      throw new Error("signer not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.owner);

    if (!this.username) {
      throw new Error("username not set");
    }

    if (!this.addressChainIds || this.addressChainIds.length === 0) {
      throw new Error("address chain ids not set");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestICNSAdr36SignaturesMsg.type();
  }
}

export class RequestVerifyADR36AminoSignDoc extends Message<boolean> {
  public static type() {
    return "request-verify-adr-36-amino-doc";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly data: Uint8Array,
    public readonly signature: StdSignature
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    if (!this.signature) {
      throw new Error("Signature not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.signer);
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestVerifyADR36AminoSignDoc.type();
  }
}

export class RequestSignDirectMsg extends Message<{
  readonly signed: {
    bodyBytes: Uint8Array;
    authInfoBytes: Uint8Array;
    chainId: string;
    accountNumber: string;
  };
  readonly signature: StdSignature;
}> {
  public static type() {
    return "request-sign-direct";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDoc: {
      bodyBytes?: Uint8Array;
      authInfoBytes?: Uint8Array;
      chainId?: string;
      accountNumber?: string;
    },
    public readonly signOptions: KeplrSignOptions = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // Validate bech32 address.
    Bech32Address.validate(this.signer);

    const signDoc = SignDoc.fromPartial({
      bodyBytes: this.signDoc.bodyBytes,
      authInfoBytes: this.signDoc.authInfoBytes,
      chainId: this.signDoc.chainId,
      accountNumber: this.signDoc.accountNumber,
    });

    if (signDoc.chainId !== this.chainId) {
      throw new Error(
        "Chain id in the message is not matched with the requested chain id"
      );
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return RequestSignDirectMsg.type();
  }
}

export class GetMultiKeyStoreInfoMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "get-multi-key-store-info";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetMultiKeyStoreInfoMsg.type();
  }
}

export class ChangeKeyRingMsg extends Message<{
  multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
}> {
  public static type() {
    return "change-keyring";
  }

  constructor(public readonly index: number) {
    super();
  }

  validateBasic(): void {
    if (this.index < 0) {
      throw new Error("Index is negative");
    }

    if (!Number.isInteger(this.index)) {
      throw new Error("Invalid index");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ChangeKeyRingMsg.type();
  }
}

// Return the list of selectable path.
// If coin type was set for the key store, will return empty array.
export class GetIsKeyStoreCoinTypeSetMsg extends Message<
  {
    readonly path: BIP44;
    readonly bech32Address: string;
  }[]
> {
  public static type() {
    return "get-is-keystore-coin-type-set";
  }

  constructor(public readonly chainId: string, public readonly paths: BIP44[]) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (this.paths.length === 0) {
      throw new Error("empty bip44 path list");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return GetIsKeyStoreCoinTypeSetMsg.type();
  }
}

export class SetKeyStoreCoinTypeMsg extends Message<KeyRingStatus> {
  public static type() {
    return "set-keystore-coin-type";
  }

  constructor(
    public readonly chainId: string,
    public readonly coinType: number
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (this.coinType < 0) {
      throw new Error("coin type can not be negative");
    }

    if (!Number.isInteger(this.coinType)) {
      throw new Error("coin type should be integer");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SetKeyStoreCoinTypeMsg.type();
  }
}

export class CheckPasswordMsg extends Message<boolean> {
  public static type() {
    return "check-keyring-password";
  }

  constructor(public readonly password: string) {
    super();
  }

  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return CheckPasswordMsg.type();
  }
}

export class ExportKeyRingDatasMsg extends Message<ExportKeyRingData[]> {
  public static type() {
    return "export-keyring-datas";
  }

  constructor(public readonly password: string) {
    super();
  }

  validateBasic(): void {
    if (!this.password) {
      throw new Error("password not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ExportKeyRingDatasMsg.type();
  }
}

export class InitNonDefaultLedgerAppMsg extends Message<void> {
  public static type() {
    return "init-non-default-ledger-app";
  }

  constructor(public readonly ledgerApp: LedgerApp) {
    super();
  }

  validateBasic(): void {
    if (!this.ledgerApp) {
      throw new Error("ledger app not set");
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return InitNonDefaultLedgerAppMsg.type();
  }
}

export class ChangeKeyRingNameMsg extends Message<string> {
  public static type() {
    return "change-keyring-name-msg";
  }

  constructor(
    public readonly defaultName: string,
    public readonly editable: boolean
  ) {
    super();
  }

  validateBasic(): void {
    // Not allow empty name.
    if (!this.defaultName) {
      throw new Error("default name not set");
    }
  }

  override approveExternal(): boolean {
    return true;
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return ChangeKeyRingNameMsg.type();
  }
}

export class StatusMsg extends Message<WalletStatus> {
  public static type() {
    return "status-msg";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return StatusMsg.type();
  }
}

export class UnlockWalletMsg extends Message<void> {
  public static type() {
    return "unlock-wallet-msg";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return UnlockWalletMsg.type();
  }
}

export class LockWalletMsg extends Message<void> {
  public static type() {
    return "lock-wallet-msg";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return LockWalletMsg.type();
  }
}

export class CurrentAccountMsg extends Message<Account> {
  public static type() {
    return "current-account-msg";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return CurrentAccountMsg.type();
  }
}

export class SwitchAccountMsg extends Message<void> {
  public static type() {
    return "switch-account-msg";
  }

  constructor(public readonly address: string) {
    super();
  }

  validateBasic(): void {
    if (!this.address) {
      throw new Error("address is empty");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return SwitchAccountMsg.type();
  }
}

export class ListAccountsMsg extends Message<Account[]> {
  public static type() {
    return "list-account-msg";
  }

  constructor() {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return ListAccountsMsg.type();
  }
}

export class GetAccountMsg extends Message<Account | null> {
  public static type() {
    return "get-account-msg";
  }

  constructor(public readonly address: string) {
    super();
  }

  validateBasic(): void {
    if (!this.address) {
      throw new Error("address is empty");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return GetAccountMsg.type();
  }
}

export class GetKeyMsgFetchSigning extends Message<Key> {
  public static type() {
    return "get-key-fetch-signing";
  }

  constructor(public readonly chainId: string) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return GetKeyMsgFetchSigning.type();
  }
}

export class RequestSignAminoMsgFetchSigning extends Message<AminoSignResponse> {
  public static type() {
    return "request-sign-amino-fetch-signing";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDoc: StdSignDoc,
    public readonly signOptions: KeplrSignOptions & {
      // Hack option field to detect the sign arbitrary for string
      isADR36WithString?: boolean;
      ethSignType?: EthSignType;
    } = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // It is not important to check this on the client side as opposed to increasing the bundle size.
    // Validate bech32 address.
    // Bech32Address.validate(this.signer);

    const signDoc = this.signDoc;

    // Check that the sign doc is for ADR-36,
    // the validation should be performed on the background.
    const hasOnlyMsgSignData = (() => {
      if (
        signDoc &&
        signDoc.msgs &&
        Array.isArray(signDoc.msgs) &&
        signDoc.msgs.length === 1
      ) {
        const msg = signDoc.msgs[0];
        return msg.type === "sign/MsgSignData";
      } else {
        return false;
      }
    })();

    // If the sign doc is expected to be for ADR-36,
    // it doesn't have to have the chain id in the sign doc.
    if (!hasOnlyMsgSignData && signDoc.chain_id !== this.chainId) {
      throw new Error(
        "Chain id in the message is not matched with the requested chain id"
      );
    }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return RequestSignAminoMsgFetchSigning.type();
  }
}

export class RequestSignDirectMsgFetchSigning extends Message<{
  readonly signed: {
    bodyBytes: Uint8Array;
    authInfoBytes: Uint8Array;
    chainId: string;
    accountNumber: string;
  };
  readonly signature: StdSignature;
}> {
  public static type() {
    return "request-sign-direct-fetch-signing";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly signDoc: {
      bodyBytes?: Uint8Array | null;
      authInfoBytes?: Uint8Array | null;
      chainId?: string | null;
      accountNumber?: string | null;
    },
    public readonly signOptions: KeplrSignOptions = {}
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    // It is not important to check this on the client side as opposed to increasing the bundle size.
    // Validate bech32 address.
    // Bech32Address.validate(this.signer);

    // const signDoc = cosmos.tx.v1beta1.SignDoc.create({
    //   bodyBytes: this.signDoc.bodyBytes,
    //   authInfoBytes: this.signDoc.authInfoBytes,
    //   chainId: this.signDoc.chainId,
    //   accountNumber: this.signDoc.accountNumber
    //     ? Long.fromString(this.signDoc.accountNumber)
    //     : undefined,
    // });
    //
    // if (signDoc.chainId !== this.chainId) {
    //   throw new Error(
    //     "Chain id in the message is not matched with the requested chain id"
    //   );
    // }

    if (!this.signOptions) {
      throw new Error("Sign options are null");
    }
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return RequestSignDirectMsgFetchSigning.type();
  }
}

export class RequestVerifyADR36AminoSignDocFetchSigning extends Message<boolean> {
  public static type() {
    return "request-verify-adr-36-amino-doc-fetch-signing";
  }

  constructor(
    public readonly chainId: string,
    public readonly signer: string,
    public readonly data: Uint8Array,
    public readonly signature: StdSignature
  ) {
    super();
  }

  validateBasic(): void {
    if (!this.chainId) {
      throw new Error("chain id not set");
    }

    if (!this.signer) {
      throw new Error("signer not set");
    }

    if (!this.signature) {
      throw new Error("Signature not set");
    }

    // It is not important to check this on the client side as opposed to increasing the bundle size.
    // Validate bech32 address.
    // Bech32Address.validate(this.signer);
  }

  route(): string {
    return "keyring";
  }

  type(): string {
    return RequestVerifyADR36AminoSignDocFetchSigning.type();
  }
}
