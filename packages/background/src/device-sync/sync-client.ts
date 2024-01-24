import {
  ApolloClient,
  InMemoryCache,
  gql,
  DefaultOptions,
} from "@apollo/client";
import { SyncData } from "./types";

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

export const getRemoteData = async (
  deviceSyncUrl: string,
  accessToken: string
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
        ? decryptData(data.walletInfo.data)
        : emptyData,
  };
};

export const setRemoteData = async (
  deviceSyncUrl: string,
  accessToken: string,
  syncData: SyncData
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
        data: encryptData(syncData.data),
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

const encryptData = (data: SyncData["data"]): string => {
  return JSON.stringify(data);
};

const decryptData = (encryptedData: string): SyncData["data"] => {
  return JSON.parse(encryptedData);
};
