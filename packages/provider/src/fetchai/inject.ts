import { createBrowserWindowProxy } from "./proxy";
import { FetchBrowserWallet, WalletApi } from "@fetchai/wallet-types";
import { Keplr } from "@keplr-wallet/types";
import {
  InjectedFetchAccount,
  InjectedFetchAddressBook,
  InjectedFetchNetworks,
  InjectedFetchSigning,
  InjectedFetchWalletApi,
} from "./wallet-api";
import { defineUnwritablePropertyIfPossible } from "../inject";

export class BrowserInjectedFetchWallet implements FetchBrowserWallet {
  readonly keplr: Keplr;
  readonly version: string;
  readonly wallet: WalletApi;

  constructor(keplr: Keplr, version: string) {
    this.keplr = keplr;
    this.version = version;
    this.wallet = new InjectedFetchWalletApi(
      new InjectedFetchNetworks(createBrowserWindowProxy()),
      new InjectedFetchAccount(createBrowserWindowProxy()),
      new InjectedFetchSigning(createBrowserWindowProxy()),
      new InjectedFetchAddressBook(createBrowserWindowProxy()),
      createBrowserWindowProxy()
    );
  }
}

export function injectFetchWalletToWindow(
  fetchBrowserWallet: FetchBrowserWallet
): void {
  defineUnwritablePropertyIfPossible(
    window,
    "fetchBrowserWallet",
    fetchBrowserWallet
  );
  defineUnwritablePropertyIfPossible(
    window,
    "getOfflineSigner",
    fetchBrowserWallet.wallet.signing.getOfflineSigner
  );
  defineUnwritablePropertyIfPossible(
    window,
    "getOfflineAminoSigner",
    fetchBrowserWallet.wallet.signing.getOfflineAminoSigner
  );
  defineUnwritablePropertyIfPossible(
    window,
    "getOfflineDirectSigner",
    fetchBrowserWallet.wallet.signing.getOfflineDirectSigner
  );
  defineUnwritablePropertyIfPossible(
    window,
    "getOfflineSigner",
    fetchBrowserWallet.wallet.signing.getOfflineSigner
  );
}
