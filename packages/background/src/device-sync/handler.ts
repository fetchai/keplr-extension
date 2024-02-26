import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  GetDeviceSyncStatusMsg,
  UpdateDeviceSyncCredentialsMsg,
  HasSyncRemoteDataMsg,
  SyncDeviceMsg,
  SetKrPasswordMsg,
  SetPauseMsg,
  SetDeviceSyncPasswordMsg,
  GetRemoteVersionMsg,
  GetRemoteDeviceNamesMsg,
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
      case SetDeviceSyncPasswordMsg:
        return handleSetDeviceSyncPasswordMsg(service)(
          env,
          msg as SetDeviceSyncPasswordMsg
        );
      case GetRemoteVersionMsg:
        return handleGetRemoteVersionMsg(service)(
          env,
          msg as GetRemoteVersionMsg
        );
      case GetRemoteDeviceNamesMsg:
        return handleGetRemoteDeviceNamesMsg(service)(
          env,
          msg as GetRemoteDeviceNamesMsg
        );
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
  return async (_, msg) => {
    return await service.syncDevice(msg.syncPassword, msg.deviceName);
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

const handleSetDeviceSyncPasswordMsg: (
  service: DeviceSyncService
) => InternalHandler<SetKrPasswordMsg> = (service) => {
  return (_, msg) => {
    return service.setDeviceSyncPassword(msg.password);
  };
};

const handleGetRemoteVersionMsg: (
  service: DeviceSyncService
) => InternalHandler<GetRemoteVersionMsg> = (service) => {
  return async (_) => {
    return await service.getRemoteVersion();
  };
};

const handleGetRemoteDeviceNamesMsg: (
  service: DeviceSyncService
) => InternalHandler<GetRemoteDeviceNamesMsg> = (service) => {
  return async (_, msg) => {
    return await service.getRemoteDeviceNames(msg.password);
  };
};
