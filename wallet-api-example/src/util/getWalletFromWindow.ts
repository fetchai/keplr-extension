import { FetchBrowserWallet } from "@fetchai/wallet-types";

export const getFetchWalletFromWindow: () => Promise<
  FetchBrowserWallet | undefined
> = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.fetchBrowserWallet) {
    return window.fetchBrowserWallet;
  }

  if (document.readyState === "complete") {
    return window.fetchBrowserWallet;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(window.fetchBrowserWallet);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};
