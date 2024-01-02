import {
  InjectedKeplr,
  BrowserInjectedFetchWallet,
} from "@keplr-wallet/provider";

import manifest from "../../manifest.v2.json";
import { injectKeplrToWindow } from "@keplr-wallet/provider/src";

const keplr = new InjectedKeplr(manifest.version, "extension");

const fetchWallet = new BrowserInjectedFetchWallet(keplr, manifest.version);

injectKeplrToWindow(keplr, fetchWallet);
