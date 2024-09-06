// eslint-disable-next-line import/no-extraneous-dependencies
import "setimmediate";

if (typeof Buffer === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.Buffer = require("buffer").Buffer;
}

if (!global.atob || !global.btoa) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const base64 = require("./shim-base64.js");
  global.atob = base64.atob;
  global.btoa = base64.btoa;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TextEncodingPolyfill = require("text-encoding");
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

import { polyfillWebCrypto } from "react-native-crypto-polyfill";

polyfillWebCrypto();
// crypto is now globally defined

import "react-native-url-polyfill/auto";

const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env["NODE_ENV"] = isDev ? "development" : "production";

import EventEmitter from "eventemitter3";

const eventListener = new EventEmitter();

window.addEventListener = (type, fn, options) => {
  if (options && options.once) {
    eventListener.once(type, fn);
  } else {
    eventListener.addListener(type, fn);
  }
};

window.removeEventListener = (type, fn) => {
  eventListener.removeListener(type, fn);
};

window.dispatchEvent = (event) => {
  eventListener.emit(event.type);
};

import "@walletconnect/react-native-compat";
