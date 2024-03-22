import { AddressBookEntry } from "@fetchai/wallet-types";
import { InteractionService } from "../interaction";
import {
  AddEntryMsg,
  DeleteEntryMsg,
  ListEntriesMsg,
  UpdateEntryMsg,
} from "./messages";
import { Env } from "@keplr-wallet/router";

export class AddressBookService {
  protected interactionService!: InteractionService;
  protected addressBook: AddressBookEntry[] = [];

  constructor() {
    //noop
  }

  init(interactionService: InteractionService) {
    this.interactionService = interactionService;
  }

  public syncAddressBookData(_addressBook: AddressBookEntry[]) {
    this.addressBook = _addressBook;
  }

  public async listEntries(env: Env, chainId: string, origin: string) {
    await this.interactionService.waitApprove(
      env,
      "/list-entries",
      ListEntriesMsg.type(),
      {
        chainId,
        origin,
      }
    );
    return this.addressBook;
  }

  public async addEntry(env: Env, entry: AddressBookEntry, origin: string) {
    await this.interactionService.waitApprove(
      env,
      "/add-entry",
      AddEntryMsg.type(),
      {
        entry,
        origin,
      }
    );
  }

  public async updateEntry(env: Env, entry: AddressBookEntry, origin: string) {
    await this.interactionService.waitApprove(
      env,
      "/update-entry",
      UpdateEntryMsg.type(),
      {
        entry,
        origin,
      }
    );
  }

  public async deleteEntry(env: Env, address: string, origin: string) {
    await this.interactionService.waitApprove(
      env,
      "/delete-entry",
      DeleteEntryMsg.type(),
      {
        address,
        origin,
      }
    );
  }
}
