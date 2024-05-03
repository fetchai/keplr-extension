import { JSONUint8Array, Result } from "@keplr-wallet/router";
import { Method } from "./types";

export interface ProxyRequest {
  type: "fetchai:proxy-request-v1";
  id: string;
  method: Method;
  args: any[];
}

export interface ProxyResponse {
  type: "fetchai:proxy-response-v1";
  id: string;
  result: Result | undefined;
}

function generateNewRequestId(): string {
  const bytes = new Uint8Array(8);
  return Array.from(crypto.getRandomValues(bytes))
    .map((value) => {
      return value.toString(16);
    })
    .join("");
}

export function createProxyRequest(method: Method, args: any[]): ProxyRequest {
  return {
    type: "fetchai:proxy-request-v1",
    id: generateNewRequestId(),
    method,
    args: JSONUint8Array.wrap(args),
  };
}

export function createProxyResponse(
  id: string,
  result: Result | undefined
): ProxyResponse {
  return {
    type: "fetchai:proxy-response-v1",
    id,
    result,
  };
}

function isProxyRequest(obj: any): obj is ProxyRequest {
  return !(!obj?.id || obj.type !== "fetchai:proxy-request-v1");
}

function isProxyResponse(obj: any): obj is ProxyResponse {
  return !(!obj?.id || obj.type !== "fetchai:proxy-response-v1");
}

export function toProxyRequest(obj: any): ProxyRequest | undefined {
  if (isProxyRequest(obj)) {
    return obj;
  }
}

export function toProxyResponse(obj: any): ProxyResponse | undefined {
  if (isProxyResponse(obj)) {
    return obj;
  }
}

export function requestViaProxy(
  method: Method,
  args: any[],
  proxy: Proxy
): Promise<any> {
  const proxyRequest = createProxyRequest(method, args);

  return new Promise((resolve, reject) => {
    const messageHandler = (e: any) => {
      const proxyResponse = toProxyResponse(e.data);
      if (proxyResponse === undefined) {
        return;
      }

      if (
        !proxyResponse ||
        proxyResponse.type !== "fetchai:proxy-response-v1"
      ) {
        return;
      }

      if (proxyResponse.id !== proxyRequest.id) {
        return;
      }

      proxy.removeMessageHandler(messageHandler);

      const result = JSONUint8Array.unwrap(proxyResponse.result);
      if (!result) {
        reject(new Error("Result is null"));
        return;
      }

      if (result.error) {
        reject(new Error(result.error));
        return;
      }

      resolve(result.return);
    };

    proxy.addMessageHandler(messageHandler);
    proxy.sendMessage(proxyRequest);
  });
}

export interface Proxy {
  addMessageHandler: (handler: (e: any) => void) => void;
  removeMessageHandler: (handler: (e: any) => void) => void;
  sendMessage: (message: any) => void;
}

export function createBrowserWindowProxy(): Proxy {
  return {
    addMessageHandler: (fn: (e: any) => void) =>
      window.addEventListener("message", fn),
    removeMessageHandler: (fn: (e: any) => void) =>
      window.removeEventListener("message", fn),
    sendMessage: (message) =>
      window.postMessage(message, window.location.origin),
  };
}
