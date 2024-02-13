import { Message } from "@keplr-wallet/router";
import { ROUTE } from "./constants";
import { AccessToken, SyncStatus } from "./types";

export class HasSyncRemoteDataMsg extends Message<boolean> {
  public static type() {
    return "has-sync-remote-data";
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
    return HasSyncRemoteDataMsg.type();
  }
}

export class GetDeviceSyncStatusMsg extends Message<SyncStatus> {
  public static type() {
    return "get-device-sync-status";
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
    return GetDeviceSyncStatusMsg.type();
  }
}

export class UpdateDeviceSyncCredentialsMsg extends Message<SyncStatus> {
  public static type() {
    return "update-device-sync-credentials";
  }

  constructor(
    public readonly email: string,
    public readonly accessToken?: AccessToken
  ) {
    super();
  }

  validateBasic(): void {
    if (this.accessToken) {
      Object.values(this.accessToken).forEach((v) => {
        if (v === "") {
          throw new Error("invalid token values");
        }
      });
    }
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return UpdateDeviceSyncCredentialsMsg.type();
  }
}

export class SyncDeviceMsg extends Message<void> {
  public static type() {
    return "sync-device";
  }

  constructor(public readonly password?: string) {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SyncDeviceMsg.type();
  }
}

export class SetKrPasswordMsg extends Message<void> {
  public static type() {
    return "set-kr-password";
  }

  constructor(public readonly password: string) {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SetKrPasswordMsg.type();
  }
}

export class SetPauseMsg extends Message<void> {
  public static type() {
    return "set-pause";
  }

  constructor(public readonly value: boolean) {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return SetPauseMsg.type();
  }
}
