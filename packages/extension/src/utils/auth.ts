import axios from "axios";

import { Window as KeplrWindow } from "@keplr-wallet/types";

// import { AccountType } from "../components/Keplr/walletSlice";
import { toBase64 } from "@cosmjs/encoding";
import { serializeSignDoc } from "@cosmjs/launchpad";
declare let window: Window;

class RequestError extends Error {
  constructor(message: string) {
    super(`Request failed: ${message}`);
    this.name = "RequestError";
  }
}

class RejectError extends Error {
  constructor(message: string) {
    super(`Request rejected: ${message}`);
    this.name = "RejectError";
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const signArbitrary = async (chainId: string, account: any, data: string) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  console.log("encodedencodeddata", encoded);

  const signDoc = {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer: account.address,
          data: toBase64(encoded),
        },
      },
    ],
    memo: "",
  };
  //  console.log("window",window,chainId,);
  //  console.log("Final details ",chainId,account.address,signDoc,);

  const response = await window?.keplr?.signAmino(
    chainId,
    account.address,
    signDoc,
    { isADR36WithString: true } as any
  );

  if (response === undefined) {
    return undefined;
  }

  return {
    signature: response.signature.signature,
    public_key: account.pubkey,
    signed_bytes: toBase64(serializeSignDoc(response.signed)),
  };
};

export const getJWT = async (chainId: string, account: any, url: string) => {
  if (window === undefined) {
    console.log("no fetch wallet");
    return "";
  }
  const config = {
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  const request = {
    address: account.address,
    public_key: account.pubkey,
  };

  console.log("request", request);

  const r1 = await axios.post(`${url}/request_token`, request, config);
  console.log("Request status: ", r1.status);
  console.log("data payload", r1.data.payload);

  if (r1.status !== 200) throw new RequestError(r1.statusText);

  let loginRequest = undefined;

  // let account1={
  //   address: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
  //   pubkey: "02374e853b83f99f516caef4ee117a63bc90a20a89a0929b8d549f46568c63ff65"
  // }
  // let chain_id_1="fetchhub-4"

  try {
    loginRequest = await signArbitrary(chainId, account, r1.data.payload);
  } catch (err: any) {
    throw new RejectError(err);
  }

  console.log("Login request: ", loginRequest);

  if (loginRequest === undefined) {
    console.log("Failed to sign challenge!");
    return undefined;
  }

  const r2 = await axios.post(`${url}/login`, loginRequest, config);

  if (r2.status !== 200) throw new RequestError(r1.statusText);
  return r2.data.token;
};
