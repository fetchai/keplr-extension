import { KVStore } from "@keplr-wallet/common";
import generateHash from "object-hash";
import axios from "axios";
import {
  BIP44HDPath,
  ExportKeyRingData,
  KeyRingStatus,
  MultiKeyStoreInfoWithSelected,
} from "../keyring";
import { AccessToken, AddressBookData, SyncData, SyncStatus } from "./types";
import { getRemoteData, setRemoteData } from "./sync-client";
import { KeyCurve } from "@keplr-wallet/crypto";
import { ChainInfoWithCoreTypes } from "src/chains";

interface IKeyRingService {
  exportKeyRingDatas: (password: string) => Promise<ExportKeyRingData[]>;
  addMnemonicKey: (
    kdf: "scrypt" | "sha256" | "pbkdf2",
    mnemonic: string,
    meta: Record<string, string>,
    bip44HDPath: BIP44HDPath,
    curve?: KeyCurve
  ) => Promise<{
    multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
  }>;
  addPrivateKey: (
    kdf: "scrypt" | "sha256" | "pbkdf2",
    privateKey: Uint8Array,
    meta: Record<string, string>,
    curve?: KeyCurve
  ) => Promise<{
    multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
  }>;
  deleteKeyRing: (
    index: number,
    password: string
  ) => Promise<{
    multiKeyStoreInfo: MultiKeyStoreInfoWithSelected;
    status: KeyRingStatus;
  }>;
  readonly keyRingStatus: KeyRingStatus;
}

export class DeviceSyncService {
  protected keyringService!: IKeyRingService;

  protected chainService!: {
    getChainInfos: () => Promise<ChainInfoWithCoreTypes[]>;
  };

  protected token: AccessToken | undefined;

  protected email: string = "";
  protected krPassword: string = "";
  protected localData: SyncData = {
    version: 0,
    hash: "",
    data: {
      keyringData: [],
      addressBooks: {},
    },
  };

  protected syncTimer: NodeJS.Timer | null = null;

  constructor(
    protected readonly kvStore: KVStore,
    protected readonly opts: {
      readonly monitoringInterval: number;
    } = {
      monitoringInterval: 300000, // 5 mins
    }
  ) {}

  async init(
    keyringService: IKeyRingService,
    chainService: {
      getChainInfos: () => Promise<ChainInfoWithCoreTypes[]>;
    }
  ) {
    this.keyringService = keyringService;
    this.chainService = chainService;

    browser.idle.onStateChanged.addListener((idle) => {
      this.stateChangedHandler(idle);
    });

    await this.loadKeyStoreValues();
  }

  private stateChangedHandler(newState: browser.idle.IdleState) {
    if (this.email !== "") {
      if ((newState as any) === "locked") {
        this.stopSyncTimer();
      }
    }
  }

  startSyncTimer(deviceSyncUrl: string, password?: string) {
    this.stopSyncTimer();

    if (password) {
      this.krPassword = password;
    }

    try {
      this.syncDevice(deviceSyncUrl);
    } catch (e) {
      console.error(`Error syncing device: ${e}`);
    }

    this.syncTimer = setInterval(() => {
      try {
        this.syncDevice(deviceSyncUrl);
      } catch (e) {
        console.error(`Error syncing device: ${e}`);
      }
    }, this.opts.monitoringInterval);
  }

  private stopSyncTimer() {
    if (this.syncTimer != null) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  get keyRingIsUnlocked(): boolean {
    if (this.keyringService == null) {
      throw new Error("Keyring service is null");
    }

    return this.keyringService.keyRingStatus === KeyRingStatus.UNLOCKED;
  }

  public getEmail(): string {
    return this.email;
  }

  public setCredentials(
    email: string,
    accessToken?: AccessToken
  ): Promise<void> {
    this.email = email;
    if (accessToken) {
      this.token = accessToken;
      this.kvStore.set("ds_access_token", accessToken);
    }

    return this.kvStore.set("ds_email", email);
  }

  public getSyncStatus(): SyncStatus {
    const refreshTokenExpired = this.token?.refreshExpiresIn
      ? new Date().getTime() > this.token.refreshExpiresIn * 1000
      : false;

    return {
      tokenExpired: !this.token || refreshTokenExpired,
      passwordNotAvailable: this.krPassword === "",
    };
  }

  private async loadKeyStoreValues() {
    this.email = (await this.kvStore.get<string>("ds_email")) ?? "";
    this.token = await this.kvStore.get<AccessToken>("ds_access_token");
    this.localData = (await this.kvStore.get<SyncData>("ds_local_data")) ?? {
      version: 0,
      hash: "",
      data: {
        keyringData: [],
        addressBooks: {},
      },
    };
  }

  private async syncDevice(deviceSyncUrl: string) {
    if (
      this.email === "" ||
      this.krPassword === "" ||
      !this.keyRingIsUnlocked ||
      !this.token
    ) {
      return;
    }

    const refreshTokenExpired = this.token.refreshExpiresIn
      ? new Date().getTime() > this.token.refreshExpiresIn * 1000
      : false;

    if (refreshTokenExpired) {
      return;
    }

    if (!this.token) {
      return;
    }

    await this.refreshAccessTokenIfExpired();

    const remoteData = await getRemoteData(
      deviceSyncUrl,
      this.token.accessToken
    );

    const remoteVersion = remoteData.version;
    const remoteHash = this.createHash(remoteData.data);

    // If remote is updated. Update local data.
    if (remoteVersion > this.localData.version) {
      // This updates the local data with new remote version only and applies the updates to the wallet
      await this.updateLocalData(remoteData);
    } else {
      const localData = await this.getLocalData();
      if (localData.hash !== this.localData.hash) {
        this.localData = { ...this.localData, ...localData };
        this.kvStore.set("ds_local_data", this.localData);
      }
    }

    // If local was updated
    if (this.localData.hash !== remoteHash) {
      await setRemoteData(deviceSyncUrl, this.token.accessToken, {
        ...this.localData,
        version: this.localData.version + 1,
      });

      this.localData.version++;
      this.kvStore.set("ds_local_data", this.localData);
    }
  }

  private async getLocalData(): Promise<Omit<SyncData, "version">> {
    // Keyring data
    const krData = await this.keyringService.exportKeyRingDatas(
      this.krPassword
    );

    // Address book data
    const addressBookData =
      krData.length > 0 ? await this.loadAddressBookData() : {};

    const data = {
      keyringData: krData,
      addressBooks: addressBookData,
    };

    const hash = krData.length > 0 ? this.createHash(data) : "";
    return {
      data,
      hash,
    };
  }

  private async refreshAccessTokenIfExpired() {
    if (!this.token) {
      return;
    }

    const refreshTokenExpired = this.token.refreshExpiresIn
      ? new Date().getTime() > this.token.refreshExpiresIn * 1000
      : false;

    if (refreshTokenExpired) {
      return;
    }

    const accessTokenExpired = this.token.expiresIn
      ? new Date().getTime() > this.token.expiresIn * 1000
      : false;

    if (accessTokenExpired) {
      const r = await axios.post(
        "https://accounts.fetch.ai/v1/tokens",
        {
          grant_type: "refresh_token",
          refresh_token: this.token.refreshToken,
        },
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );

      if (r.status !== 200) {
        throw new Error("Error generating refresh token");
      }

      const token = {
        accessToken: r.data.access_token,
        refreshToken: r.data.refresh_token,
        expiresIn: r.data.expires_in,
        refreshExpiresIn: r.data.refresh_expires_in,
      };
      this.token = token;
      this.kvStore.set("ds_access_token", token);
    }
  }

  private async updateLocalData(remoteData: Omit<SyncData, "hash">) {
    const keyRings: { [key: string]: ExportKeyRingData } = {};
    const prevData = this.localData;

    let localData = await this.getLocalData();

    const prevKrs = prevData.data.keyringData.map((kr) => {
      keyRings[kr.key] = kr;
      return kr.key;
    });

    const remoteKrs = remoteData.data.keyringData.map((kr) => {
      keyRings[kr.key] = kr;
      return kr.key;
    });

    const localKrs = localData.data.keyringData.map((kr) => {
      keyRings[kr.key] = kr;
      return kr.key;
    });

    const krsLocallyAdded = localKrs.filter((kr) => !prevKrs.includes(kr));
    const krsLocallyRemoved = prevKrs.filter((kr) => !localKrs.includes(kr));

    const duplicationCheck = new Map<string, boolean>();
    for (const key of remoteKrs) {
      if (
        !duplicationCheck.get(key) &&
        !localKrs.includes(key) &&
        !krsLocallyRemoved.includes(key)
      ) {
        const kr = keyRings[key];

        if (kr.type === "mnemonic") {
          await this.keyringService.addMnemonicKey(
            "scrypt", //TODO: take as protected value
            kr.key,
            kr.meta,
            kr.bip44HDPath
          );
        }

        if (kr.type === "privateKey") {
          await this.keyringService.addPrivateKey(
            "scrypt",
            Buffer.from(kr.key, "hex"),
            kr.meta
          );
        }

        duplicationCheck.set(key, true);
      }
    }

    for (const [idx, key] of localKrs.entries()) {
      if (!remoteKrs.includes(key) && !krsLocallyAdded.includes(key)) {
        await this.keyringService.deleteKeyRing(idx, this.krPassword);
      }
    }

    localData = await this.getLocalData();

    this.localData.version = remoteData.version;
    this.localData.data = localData.data;
    this.localData.hash = localData.hash;
    this.kvStore.set("ds_local_data", this.localData);
  }

  private async loadAddressBookData(): Promise<{
    [chainId: string]: AddressBookData[] | undefined;
  }> {
    // const chains = await this.chainService.getChainInfos();
    return {};
  }

  private createHash(data: SyncData["data"]): string {
    const updatedAndSortedData = {
      krs: data.keyringData
        .map((kr) => {
          return {
            key: kr.key,
            name: kr.meta["name"] ?? "fetch-account",
          };
        })
        .sort((a, b) => (a.key > b.key ? 1 : b.key > a.key ? -1 : 0)),
      abs: data.addressBooks,
    };

    return generateHash(updatedAndSortedData);
  }
}
