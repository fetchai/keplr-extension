import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import {
  GetDeviceSyncEmailMsg,
  GetDeviceSyncStatusMsg,
  UpdateDeviceSyncCredentialsMsg,
  StartDeviceSyncMsg,
} from "./messages";
import { DeviceSyncService } from "./service";

export const getHandler: (service: DeviceSyncService) => Handler = (
  service: DeviceSyncService
) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case GetDeviceSyncEmailMsg:
        return handleGetDeviceSyncEmailMsg(service)(
          env,
          msg as GetDeviceSyncEmailMsg
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
      case StartDeviceSyncMsg:
        return handleStartDeviceSyncMsg(service)(
          env,
          msg as StartDeviceSyncMsg
        );
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handleGetDeviceSyncEmailMsg: (
  service: DeviceSyncService
) => InternalHandler<GetDeviceSyncEmailMsg> = (service) => {
  return () => {
    return service.getEmail();
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

const handleStartDeviceSyncMsg: (
  service: DeviceSyncService
) => InternalHandler<StartDeviceSyncMsg> = (service) => {
  return (_, msg) => {
    return service.startSyncTimer(msg.deviceSyncUrl, msg.password);
  };
};
