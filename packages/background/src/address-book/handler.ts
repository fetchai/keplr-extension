import { Env, Handler, InternalHandler, Message } from "@keplr-wallet/router";
import { AddressBookService } from "./service";
import {
  AddEntryMsg,
  DeleteEntryMsg,
  ListEntriesMsg,
  UpdateEntryMsg,
} from "./messages";
import { ExtensionKVStore } from "@keplr-wallet/common";

export const getHandler: (service: AddressBookService) => Handler = (
  service: AddressBookService
) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case ListEntriesMsg:
        return handleListEntriesMsg(service)(env, msg as ListEntriesMsg);
      case AddEntryMsg:
        return handleAddEntryMsg(service)(env, msg as AddEntryMsg);
      case UpdateEntryMsg:
        return handleUpdateEntryMsg(service)(env, msg as UpdateEntryMsg);
      case DeleteEntryMsg:
        return handleDeleteEntryMsg(service)(env, msg as DeleteEntryMsg);
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handleListEntriesMsg: (
  service: AddressBookService
) => InternalHandler<ListEntriesMsg> = (service) => {
  return async (_env, _msg) => {
    const kvStore = new ExtensionKVStore("store_chain_config");
    const chainId = await kvStore.get<string>("extension_last_view_chain_id");
    if (!chainId) {
      throw Error("could not detect current chainId");
    }
    return service.listEntries(chainId);
  };
};

const handleAddEntryMsg: (
  service: AddressBookService
) => InternalHandler<AddEntryMsg> = (service) => {
  return async (_env, _msg) => {
    return service.addEntry(_msg.entry);
  };
};

const handleUpdateEntryMsg: (
  service: AddressBookService
) => InternalHandler<UpdateEntryMsg> = (service) => {
  return async (_env, _msg) => {
    return service.updateEntry(_msg.entry);
  };
};

const handleDeleteEntryMsg: (
  service: AddressBookService
) => InternalHandler<DeleteEntryMsg> = (service) => {
  return async (_env, _msg) => {
    return service.deleteEntry(_msg.address);
  };
};
