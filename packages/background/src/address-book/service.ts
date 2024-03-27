import { AddressBookEntry } from "@fetchai/wallet-types";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { ChainsService } from "src/chains";

export class AddressBookService {
  protected addressBook: AddressBookEntry[] = [];
  protected chainService: ChainsService;
  protected kvStore: ExtensionKVStore;

  constructor(chainService: ChainsService) {
    this.chainService = chainService;
    this.kvStore = new ExtensionKVStore("address-book");
  }

  public async listEntries(chainId: string) {
    const chainInfo = await this.chainService.getChainInfo(chainId);
    const addressBook = await this.kvStore.get(`${chainInfo.chainName}`);
    console.log(addressBook);
    return addressBook as AddressBookEntry[];
  }

  public async addEntry(entry: AddressBookEntry) {
    const chainInfo = await this.chainService.getChainInfo(
      this.chainService.getSelectedChain()
    );
    const addressBook: AddressBookEntry[] | undefined =
      (await this.kvStore.get(`${chainInfo.chainName}`)) ?? [];

    addressBook.push(entry);

    await this.kvStore.set(`${chainInfo.chainName}`, addressBook);
    console.log(addressBook);
  }

  public async updateEntry(entry: AddressBookEntry) {
    const chainInfo = await this.chainService.getChainInfo(
      this.chainService.getSelectedChain()
    );
    const addressBook: AddressBookEntry[] | undefined =
      (await this.kvStore.get(`${chainInfo.chainName}`)) ?? [];

    const updatedAddressBook = addressBook.map((_entry) => {
      if (_entry.address === entry.address || _entry.name === entry.name) {
        return entry;
      } else {
        return _entry;
      }
    });

    await this.kvStore.set(`${chainInfo.chainName}`, updatedAddressBook);
    console.log(updatedAddressBook);
  }

  public async deleteEntry(address: string) {
    const chainInfo = await this.chainService.getChainInfo(
      this.chainService.getSelectedChain()
    );
    const addressBook: AddressBookEntry[] | undefined =
      (await this.kvStore.get(`${chainInfo.chainName}`)) ?? [];

    const updatedAddressBook = addressBook.filter((entry) => {
      return entry.address !== address;
    });

    console.log(updatedAddressBook);
    await this.kvStore.set(`${chainInfo.chainName}`, updatedAddressBook);
  }
}
