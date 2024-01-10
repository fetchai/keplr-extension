import { FetchBrowserWallet } from "@fetchai/wallet-types";
import { JSONUint8Array } from "@keplr-wallet/router";
import {
  createBrowserWindowProxy,
  createProxyResponse,
  ProxyRequest,
  ProxyResponse,
  toProxyRequest,
} from "./proxy";
import {
  AccountsApiMethod,
  EventsApiMethod,
  NetworksApiMethod,
  UmbralMethod,
  WalletMethod,
  WalletSigningMethod,
} from "./types";

async function dispatchRequest(
  fetchApi: FetchBrowserWallet,
  request: ProxyRequest
): Promise<any> {
  const methodArray = request.method.split(".");

  const api = methodArray[0];
  if (request.method !== undefined) {
    if (api === "umbral") {
      return await fetchApi.umbral[
        methodArray[methodArray.length - 1] as UmbralMethod
      ](
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...JSONUint8Array.unwrap(request.args)
      );
    } else if (api === "wallet") {
      if (methodArray[1] === "signing") {
        return await fetchApi.wallet.signing[
          methodArray[methodArray.length - 1] as WalletSigningMethod
        ](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(request.args)
        );
      } else if (methodArray[1] === "networks") {
        return await fetchApi.wallet.networks[
          methodArray[methodArray.length - 1] as NetworksApiMethod
        ](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(request.args)
        );
      } else if (methodArray[1] === "accounts") {
        return await fetchApi.wallet.accounts[
          methodArray[methodArray.length - 1] as AccountsApiMethod
        ](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(request.args)
        );
      } else if (methodArray[1] === "events") {
        // fetchApi.wallet.events.onStatusChanged.subscribe
        const property = await fetchApi.wallet.events[
          methodArray[methodArray.length - 2] as EventsApiMethod
        ];

        if (methodArray[methodArray.length - 1] === "subscribe") {
          property.subscribe(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...JSONUint8Array.unwrap(request.args)
          );
        } else if (methodArray[methodArray.length - 1] === "subscribe") {
          property.unsubscribe(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...JSONUint8Array.unwrap(request.args)
          );
        }
      } else {
        const method = methodArray[methodArray.length - 1] as WalletMethod;
        return await fetchApi.wallet[method](
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...JSONUint8Array.unwrap(request.args)
        );
      }
    }
  } else {
    throw new Error(`Unable to resolve request method ${request.method}`);
  }
}

async function proxyRequestHandler(
  fetchApi: FetchBrowserWallet,
  request: ProxyRequest
): Promise<ProxyResponse> {
  try {
    const result = await dispatchRequest(fetchApi, request);
    return createProxyResponse(request.id, {
      return: JSONUint8Array.wrap(result),
    });
  } catch (e: any) {
    return createProxyResponse(request.id, {
      error: e.m || e.toString(),
    });
  }
}

export async function startFetchWalletProxy(fetchApi: FetchBrowserWallet) {
  const proxy = createBrowserWindowProxy();

  const walletProxyHandler = async (e: any) => {
    const proxyRequest = toProxyRequest(e.data);
    if (proxyRequest === undefined) {
      return;
    }

    // dispatch the proxy request and then send back to the proxy the response
    proxy.sendMessage(await proxyRequestHandler(fetchApi, proxyRequest));
  };

  proxy.addMessageHandler(walletProxyHandler);
}
