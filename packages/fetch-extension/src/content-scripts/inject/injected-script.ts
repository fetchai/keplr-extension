import {
  InjectedKeplr,
  BrowserInjectedFetchWallet,
  InjectedFetchAccount,
  InjectedFetchNetworks,
  InjectedFetchSigning,
  InjectedFetchWalletApi,
} from "@keplr-wallet/provider";

import manifest from "../../manifest.v2.json";
import { injectKeplrToWindow } from "@keplr-wallet/provider/src";

const keplr = new InjectedKeplr(manifest.version, "extension");
const account = new InjectedFetchAccount();
const networks = new InjectedFetchNetworks();
const signing = new InjectedFetchSigning();
const walletApi = new InjectedFetchWalletApi(networks, account, signing);

const fetchWallet = new BrowserInjectedFetchWallet(
  keplr,
  manifest.version,
  walletApi
);

injectKeplrToWindow(keplr, fetchWallet);
