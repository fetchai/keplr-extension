import { KVStore } from "@keplr-wallet/common";
import generateHash from "object-hash";
import axios from "axios";
import { ExportSyncData, KeyRingService, KeyRingStatus } from "../keyring";
import { AccessToken, AddressBookData, SyncData, SyncStatus } from "./types";
import { getRemoteData, getRemoteVersion, setRemoteData } from "./sync-client";
// import { KeyCurve } from "@keplr-wallet/crypto";
import { ChainInfoWithCoreTypes } from "../chains";

export class DeviceSyncService {
  protected keyringService!: KeyRingService;
  protected chainService!: {
    getChainInfos: () => Promise<ChainInfoWithCoreTypes[]>;
  };

  protected token: AccessToken | undefined;
  protected paused: boolean | undefined;

  protected email: string = "";
  protected krPassword: string = "";
  protected deviceSyncPassword: string = "";
  protected deviceName: string = "";

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
    protected deviceSyncUrl: string,
    protected readonly opts: {
      readonly monitoringInterval: number;
    } = {
      monitoringInterval: 10000, // 5 mins
    }
  ) {}

  async init(
    keyringService: KeyRingService,
    chainService: {
      getChainInfos: () => Promise<ChainInfoWithCoreTypes[]>;
    }
  ) {
    this.keyringService = keyringService;
    this.chainService = chainService;
    await this.loadKeyStoreValues();
    this.startSyncTimer();
  }

  public setPassword(password: string) {
    this.krPassword = password;
  }

  private startSyncTimer() {
    this.stopSyncTimer();

    this.syncTimer = setInterval(async () => {
      await this.syncDevice();
      // try {
      // } catch (e) {
      //   console.error(`Error syncing device: ${e}`);
      // }
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

  get keyRingIsEmpty(): boolean {
    if (this.keyringService == null) {
      throw new Error("Keyring service is null");
    }

    return this.keyringService.keyRingStatus === KeyRingStatus.EMPTY;
  }

  public async setDeviceSyncPassword(password: string) {
    this.deviceSyncPassword = password;
    await this.kvStore.set("ds_sync_password", password);
  }

  public async setCredentials(
    email: string,
    accessToken?: AccessToken
  ): Promise<SyncStatus> {
    if (email === "") {
      await this.clearKeyStoreValues();
      return this.getSyncStatus();
    }

    this.email = email;
    await this.kvStore.set("ds_email", email);

    if (accessToken) {
      this.token = accessToken;
      await this.kvStore.set("ds_access_token", accessToken);
    }

    return this.getSyncStatus();
  }

  public async setPause(value: boolean) {
    this.paused = value;
    await this.kvStore.set("ds_paused", value);
  }

  public getSyncStatus(): SyncStatus {
    const refreshTokenExpired = this.token?.refreshExpiresIn
      ? new Date().getTime() > this.token.refreshExpiresIn * 1000
      : false;

    return {
      email: this.email,
      tokenExpired: !this.token || refreshTokenExpired,
      passwordNotAvailable: this.krPassword === "",
      paused: this.paused ?? false,
      syncPasswordNotAvailable: this.deviceSyncPassword === "",
    };
  }

  public async hasRemoteData(): Promise<boolean> {
    if (!this.token) {
      throw new Error("Access token not set");
    }

    const remoteData = await getRemoteData(
      this.deviceSyncUrl,
      this.token.accessToken,
      this.deviceSyncPassword
    );

    return remoteData.data.keyringData.length > 0;
  }

  private async loadKeyStoreValues() {
    this.email = (await this.kvStore.get<string>("ds_email")) ?? "";
    this.token = await this.kvStore.get<AccessToken>("ds_access_token");
    this.paused = await this.kvStore.get<boolean>("ds_paused");
    this.localData = (await this.kvStore.get<SyncData>("ds_local_data")) ?? {
      version: 0,
      hash: "",
      data: {
        keyringData: [],
        addressBooks: {},
      },
    };
    this.deviceSyncPassword =
      (await this.kvStore.get("ds_sync_password")) ?? "";
    this.deviceName = (await this.kvStore.get("ds_sync_name")) ?? "";
  }

  private async clearKeyStoreValues() {
    await this.kvStore.set("ds_email", null);
    await this.kvStore.set("ds_access_token", null);
    await this.kvStore.set("ds_paused", null);
    await this.kvStore.set("ds_local_data", null);
    await this.kvStore.set("ds_sync_password", null);
    await this.kvStore.set("ds_sync_name", null);

    this.email = "";
    this.paused = undefined;
    this.deviceSyncPassword = "";
    this.token = undefined;
    this.localData = {
      version: 0,
      hash: "",
      data: {
        keyringData: [],
        addressBooks: {},
      },
    };
    this.deviceName = "";
  }

  public async getRemoteVersion() {
    if (!this.token) {
      throw new Error("Not authenticated yet");
    }

    return await getRemoteVersion(this.deviceSyncUrl, this.token.accessToken);
  }

  public async getRemoteDeviceNames(password: string): Promise<Array<string>> {
    if (!this.token) {
      throw new Error("Not authenticated yet");
    }

    const remoteData = await getRemoteData(
      this.deviceSyncUrl,
      this.token.accessToken,
      password
    );

    const remoteDeviceNames: Array<string> = [];

    remoteData.data.keyringData.forEach((kr) => {
      if (kr.meta["deviceName"]) {
        remoteDeviceNames.push(kr.meta["deviceName"]);
      }
    });

    return remoteDeviceNames;
  }

  public async syncDevice(syncPassword?: string, syncName?: string) {
    if (syncPassword) {
      this.deviceSyncPassword = syncPassword;
      await this.kvStore.set("ds_sync_password", null);
    }

    if (syncName) {
      this.deviceName = syncName;
      await this.kvStore.set("ds_sync_name", null);
    }

    if (
      this.email === "" ||
      this.deviceSyncPassword === "" ||
      this.deviceName === "" ||
      this.krPassword === "" ||
      (!this.keyRingIsEmpty && !this.keyRingIsUnlocked) ||
      !this.token ||
      this.paused
    ) {
      return;
    }

    const refreshTokenExpired = this.token.refreshExpiresIn
      ? new Date().getTime() > this.token.refreshExpiresIn * 1000
      : false;

    if (refreshTokenExpired) {
      return;
    }

    await this.refreshAccessTokenIfExpired();

    const remoteData = await getRemoteData(
      this.deviceSyncUrl,
      this.token.accessToken,
      this.deviceSyncPassword
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
        this.localData = { version: this.localData.version, ...localData };
        this.kvStore.set("ds_local_data", this.localData);
      }
    }

    // If local was updated
    if (this.localData.hash !== remoteHash) {
      await setRemoteData(
        this.deviceSyncUrl,
        this.token.accessToken,
        {
          ...this.localData,
          version: this.localData.version + 1,
        },
        this.deviceSyncPassword
      );

      this.localData.version++;
      this.kvStore.set("ds_local_data", this.localData);
    }
  }

  private async getLocalData(): Promise<Omit<SyncData, "version">> {
    // Keyring data
    const krData = await this.keyringService.exportSyncData(
      this.krPassword,
      this.deviceName
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
    const keyRings: { [key: string]: ExportSyncData } = {};
    const prevData = this.localData;

    let localData = await this.getLocalData();

    const prevKrs = prevData.data.keyringData.map((kr) => {
      keyRings[kr.pubKey] = kr;
      return kr.pubKey;
    });

    const remoteKrs = remoteData.data.keyringData.map((kr) => {
      keyRings[kr.pubKey] = kr;
      return kr.pubKey;
    });

    const localKrs = localData.data.keyringData.map((kr) => {
      keyRings[kr.pubKey] = kr;
      return kr.pubKey;
    });

    const krsLocallyAdded = localKrs.filter((kr) => !prevKrs.includes(kr));
    const krsLocallyRemoved = prevKrs.filter((kr) => !localKrs.includes(kr));

    const duplicationCheck = new Map<string, boolean>();

    let createKeyring = localKrs.length === 0;

    for (const key of remoteKrs) {
      if (
        !duplicationCheck.get(key) &&
        !localKrs.includes(key) &&
        !krsLocallyRemoved.includes(key)
      ) {
        const kr = keyRings[key];
        if (createKeyring) {
          await this.keyringService.createSyncKey(
            "scrypt", //TODO: take as protected value
            kr,
            this.krPassword,
            kr.meta
          );

          createKeyring = false;
        } else {
          await this.keyringService.addSyncKey(
            "scrypt", //TODO: take as protected value
            kr,
            kr.meta
          );
        }
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
            key: kr.pubKey,
            name: kr.meta["name"] ?? "fetch-account",
          };
        })
        .sort((a, b) => (a.key > b.key ? 1 : b.key > a.key ? -1 : 0)),
      abs: data.addressBooks,
    };

    return generateHash(updatedAndSortedData);
  }
}
