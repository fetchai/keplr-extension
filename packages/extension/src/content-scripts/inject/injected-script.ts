import {
  InjectedKeplr,
  BrowserInjectedFetchWallet,
  FetchWalletApi,
} from "@keplr-wallet/provider";
import { init } from "./init";

import manifest from "../../manifest.json";

const keplr = new InjectedKeplr(manifest.version, "extension");
const fetchWalletApi = new FetchWalletApi();
const fetchWallet = new BrowserInjectedFetchWallet(
  keplr,
  manifest.version,
  fetchWalletApi
); // TODO: add wallet

init(
  keplr,
  fetchWallet,
  (chainId: string) => keplr.getOfflineSigner(chainId),
  (chainId: string) => keplr.getOfflineSignerOnlyAmino(chainId),
  (chainId: string) => keplr.getOfflineSignerAuto(chainId),
  (chainId: string) => keplr.getEnigmaUtils(chainId)
);
