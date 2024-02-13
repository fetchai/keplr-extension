import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  GetDeviceSyncStatusMsg,
  UpdateDeviceSyncCredentialsMsg,
  HasSyncRemoteDataMsg,
  SyncDeviceMsg,
  SetKrPasswordMsg,
  SetPauseMsg,
} from "./messages";
import { DeviceSyncService } from "./service";

export const getHandler: (service: DeviceSyncService) => Handler = (
  service: DeviceSyncService
) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case HasSyncRemoteDataMsg:
        return handleHasSyncRemoteDataMsg(service)(
          env,
          msg as HasSyncRemoteDataMsg
        );
      case GetDeviceSyncStatusMsg:
        return handleGetDeviceSyncStatusMsg(service)(
          env,
          msg as GetDeviceSyncStatusMsg
        );
      case UpdateDeviceSyncCredentialsMsg:
        return handleUpdateDeviceSyncCredentialsMsg(service)(
          env,
          msg as UpdateDeviceSyncCredentialsMsg
        );
      case SyncDeviceMsg:
        return handleSyncDeviceMsg(service)(env, msg as SyncDeviceMsg);
      case SetKrPasswordMsg:
        return handleSetKrPasswordMsg(service)(env, msg as SetKrPasswordMsg);
      case SetPauseMsg:
        return handleSetPauseMsg(service)(env, msg as SetPauseMsg);
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handleHasSyncRemoteDataMsg: (
  service: DeviceSyncService
) => InternalHandler<HasSyncRemoteDataMsg> = (service) => {
  return () => {
    return service.hasRemoteData();
  };
};

const handleGetDeviceSyncStatusMsg: (
  service: DeviceSyncService
) => InternalHandler<GetDeviceSyncStatusMsg> = (service) => {
  return () => {
    return service.getSyncStatus();
  };
};

const handleUpdateDeviceSyncCredentialsMsg: (
  service: DeviceSyncService
) => InternalHandler<UpdateDeviceSyncCredentialsMsg> = (service) => {
  return (_, msg) => {
    return service.setCredentials(msg.email, msg.accessToken);
  };
};

const handleSyncDeviceMsg: (
  service: DeviceSyncService
) => InternalHandler<SyncDeviceMsg> = (service) => {
  return (_, msg) => {
    return service.syncDevice(msg.password);
  };
};

const handleSetKrPasswordMsg: (
  service: DeviceSyncService
) => InternalHandler<SetKrPasswordMsg> = (service) => {
  return (_, msg) => {
    return service.setPassword(msg.password);
  };
};

const handleSetPauseMsg: (
  service: DeviceSyncService
) => InternalHandler<SetPauseMsg> = (service) => {
  return (_, msg) => {
    return service.setPause(msg.value);
  };
};
