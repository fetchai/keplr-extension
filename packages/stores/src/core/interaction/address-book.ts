import { AddressBookEntry } from "@fetchai/wallet-types";
import { InteractionStore } from "./interaction";
import {
  AddEntryMsg,
  DeleteEntryMsg,
  ListEntriesMsg,
  UpdateEntryMsg,
} from "@keplr-wallet/background";
import { flow, makeObservable, observable } from "mobx";

export class AddressBookStore {
  @observable
  protected _isLoading: boolean = false;

  constructor(protected readonly interactionStore: InteractionStore) {
    makeObservable(this);
  }

  get waitingSuggestedChainIdToList() {
    const datas = this.interactionStore.getDatas<{
      chainId: string;
      origin: string;
    }>(ListEntriesMsg.type());

    if (datas.length > 0) {
      return datas[0];
    }
  }

  get waitingSuggestedEntryToUpdate() {
    const datas = this.interactionStore.getDatas<{
      entry: AddressBookEntry;
      origin: string;
    }>(UpdateEntryMsg.type());

    if (datas.length > 0) {
      return datas[0];
    }
  }

  get waitingSuggestedEntryToDelete() {
    const datas = this.interactionStore.getDatas<{
      address: string;
      origin: string;
    }>(DeleteEntryMsg.type());

    if (datas.length > 0) {
      return datas[0];
    }
  }

  get waitingSuggestedEntryToAdd() {
    const datas = this.interactionStore.getDatas<{
      entry: AddressBookEntry;
      origin: string;
    }>(AddEntryMsg.type());

    if (datas.length > 0) {
      return datas[0];
    }
  }

  @flow
  *approveListEntries(chainId: string) {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedChainIdToList;

      if (data) {
        yield this.interactionStore.approve(data.type, data.id, chainId);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *approveAddEntry(entry: AddressBookEntry) {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedEntryToAdd;

      if (data) {
        yield this.interactionStore.approve(data.type, data.id, entry);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *approveUpdateEntry(entry: AddressBookEntry) {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedEntryToUpdate;

      if (data) {
        yield this.interactionStore.approve(data.type, data.id, entry);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *approveDeleteEntry(address: string) {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedEntryToDelete;

      if (data) {
        yield this.interactionStore.approve(data.type, data.id, address);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectListEntries() {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedChainIdToList;
      if (data) {
        yield this.interactionStore.reject(data.type, data.id);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectAddEntry() {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedChainIdToList;
      if (data) {
        yield this.interactionStore.reject(data.type, data.id);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectUpdateEntry() {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedChainIdToList;
      if (data) {
        yield this.interactionStore.reject(data.type, data.id);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectDeleteEntry() {
    this._isLoading = true;

    try {
      const data = this.waitingSuggestedChainIdToList;
      if (data) {
        yield this.interactionStore.reject(data.type, data.id);
      }
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectAllListEntries() {
    this._isLoading = true;
    try {
      yield this.interactionStore.rejectAll(ListEntriesMsg.type());
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectAllAddEntry() {
    this._isLoading = true;
    try {
      yield this.interactionStore.rejectAll(AddEntryMsg.type());
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectAllUpdateEntry() {
    this._isLoading = true;
    try {
      yield this.interactionStore.rejectAll(UpdateEntryMsg.type());
    } finally {
      this._isLoading = false;
    }
  }

  @flow
  *rejectAllDeleteEntry() {
    this._isLoading = true;
    try {
      yield this.interactionStore.rejectAll(DeleteEntryMsg.type());
    } finally {
      this._isLoading = false;
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}
