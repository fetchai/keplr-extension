import {
  ApolloClient,
  InMemoryCache,
  gql,
  DefaultOptions,
} from "@apollo/client";
import { SyncData } from "./types";
import { Crypto } from "../keyring/crypto";
import { KeyCurves } from "@keplr-wallet/crypto";
import { CommonCrypto, ScryptParams } from "../keyring";
import scrypt from "scrypt-js";

const commonCrypto: CommonCrypto = {
  rng: (array) => {
    return Promise.resolve(crypto.getRandomValues(array));
  },
  scrypt: async (text: string, params: ScryptParams) => {
    return await scrypt.scrypt(
      Buffer.from(text),
      Buffer.from(params.salt, "hex"),
      params.n,
      params.r,
      params.p,
      params.dklen
    );
  },
};

const inMemCache = new InMemoryCache();

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const emptyData: SyncData["data"] = {
  addressBooks: {},
  keyringData: [],
};

const getClient = (deviceSyncUrl: string) => {
  return new ApolloClient({
    uri: deviceSyncUrl,
    cache: inMemCache,
    defaultOptions,
  });
};

export const getRemoteVersion = async (
  deviceSyncUrl: string,
  accessToken: string
): Promise<number> => {
  const client = getClient(deviceSyncUrl);
  const { data } = await client.query({
    query: gql(`query Query {
        walletInfo {
          data
          version
        }
    }`),
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return (data.walletInfo && data.walletInfo.version) ?? 0;
};

export const getRemoteData = async (
  deviceSyncUrl: string,
  accessToken: string,
  syncPassword: string
): Promise<Omit<SyncData, "hash">> => {
  const client = getClient(deviceSyncUrl);
  const { data } = await client.query({
    query: gql(`query Query {
        walletInfo {
          data
          version
        }
    }`),
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return {
    version: (data.walletInfo && data.walletInfo.version) ?? 0,
    data:
      data.walletInfo && data.walletInfo.data
        ? await decryptData(data.walletInfo.data, syncPassword)
        : emptyData,
  };
};

export const setRemoteData = async (
  deviceSyncUrl: string,
  accessToken: string,
  syncData: SyncData,
  syncPassword: string
) => {
  try {
    const client = getClient(deviceSyncUrl);
    await client.mutate({
      mutation: gql(`mutation Mutation($data: String!, $version: Int!) {
        updateWalletInfo(data: $data, version: $version) {
          data
          version
        }
      }`),
      variables: {
        data: await encryptData(syncData.data, syncPassword),
        version: syncData.version,
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  } catch (e) {
    console.log(e);
    throw new Error("Setting remote data failed");
  }
};

const encryptData = async (
  data: SyncData["data"],
  password: string
): Promise<string> => {
  const encryptedData = await Crypto.encrypt(
    commonCrypto,
    "scrypt",
    "synced",
    KeyCurves.secp256k1,
    JSON.stringify(data),
    password,
    {}
  );

  return JSON.stringify(encryptedData);
};

const decryptData = async (
  encryptedData: string,
  password: string
): Promise<SyncData["data"]> => {
  const cipherText = Buffer.from(
    await Crypto.decrypt(commonCrypto, JSON.parse(encryptedData), password)
  ).toString();

  return JSON.parse(cipherText);
};
