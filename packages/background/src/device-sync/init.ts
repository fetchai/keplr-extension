import { Router } from "@keplr-wallet/router";
import {
  UpdateDeviceSyncCredentialsMsg,
  GetDeviceSyncEmailMsg,
  GetDeviceSyncStatusMsg,
  StartDeviceSyncMsg,
} from "./messages";
import { ROUTE } from "./constants";
import { getHandler } from "./handler";
import { DeviceSyncService } from "./service";

export function init(router: Router, service: DeviceSyncService): void {
  router.registerMessage(GetDeviceSyncEmailMsg);
  router.registerMessage(GetDeviceSyncStatusMsg);
  router.registerMessage(UpdateDeviceSyncCredentialsMsg);
  router.registerMessage(StartDeviceSyncMsg);

  router.addHandler(ROUTE, getHandler(service));
}
