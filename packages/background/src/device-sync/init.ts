import { Router } from "@keplr-wallet/router";
import {
  UpdateDeviceSyncCredentialsMsg,
  GetDeviceSyncStatusMsg,
  HasSyncRemoteDataMsg,
  SyncDeviceMsg,
  SetKrPasswordMsg,
  SetPauseMsg,
  SetDeviceSyncPasswordMsg,
  GetRemoteVersionMsg,
  GetRemoteDeviceNamesMsg,
} from "./messages";
import { ROUTE } from "./constants";
import { getHandler } from "./handler";
import { DeviceSyncService } from "./service";

export function init(router: Router, service: DeviceSyncService): void {
  router.registerMessage(GetDeviceSyncStatusMsg);
  router.registerMessage(UpdateDeviceSyncCredentialsMsg);
  router.registerMessage(HasSyncRemoteDataMsg);
  router.registerMessage(SyncDeviceMsg);
  router.registerMessage(SetKrPasswordMsg);
  router.registerMessage(SetPauseMsg);
  router.registerMessage(SetDeviceSyncPasswordMsg);
  router.registerMessage(GetRemoteVersionMsg);
  router.registerMessage(GetRemoteDeviceNamesMsg);

  router.addHandler(ROUTE, getHandler(service));
}
