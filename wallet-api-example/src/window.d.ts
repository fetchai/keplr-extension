import {
  Window as FetchBrowserWalletWindow,
} from "../../packages/wallet-types/src/window";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends FetchBrowserWalletWindow {}
}
