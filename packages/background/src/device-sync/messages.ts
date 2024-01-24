import { Message } from "@keplr-wallet/router";
import { ROUTE } from "./constants";
import { AccessToken, SyncStatus } from "./types";

export class GetDeviceSyncEmailMsg extends Message<string> {
  public static type() {
    return "get-device-sync-email";
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
    return GetDeviceSyncEmailMsg.type();
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

export class UpdateDeviceSyncCredentialsMsg extends Message<void> {
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

export class StartDeviceSyncMsg extends Message<void> {
  public static type() {
    return "start-device-sync";
  }

  constructor(
    public readonly deviceSyncUrl: string,
    public readonly password?: string
  ) {
    super();
  }

  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return StartDeviceSyncMsg.type();
  }
}
