import {
  ApolloClient,
  InMemoryCache,
  gql,
  DefaultOptions,
} from "@apollo/client";


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


const client = new ApolloClient({
  uri: "https://messaging-server.sandbox-london-b.fetch-ai.com/graphql",
  cache: new InMemoryCache(),
  defaultOptions,

});

export const registerPubKey = async (
  accessToken: string,
  messagingPubKey: string,
  walletAddress: string,
  channelId: string
): Promise<void> => {
  try {
    await client.mutate({
      mutation: gql(`mutation Mutation($publicKeyDetails: InputPublicKey!) {
        updatePublicKey(publicKeyDetails: $publicKeyDetails) {
          publicKey
        }
      }`),
      variables: {
        publicKeyDetails: {
          publicKey: messagingPubKey,
          address: walletAddress,
          channelId,
        },
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const getPubKey = async (
  accessToken: string,
  targetAddress: string,
  channelId: string
): Promise<string | undefined> => {
  console.log("get pub key dev5", accessToken, targetAddress, channelId);
  try {
    const { data } = await client.query({
      query: gql(`query Query($address: String!, $channelId: ChannelId!) {
        publicKey(address: $address, channelId: $channelId) {
          publicKey
        }
      }`),
      variables: {
        address: targetAddress,
        channelId,
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
    console.log("data.publicKey.publicKey", data);

    return data.publicKey.publicKey;
  } catch (e) {
    console.log(e);
  }
};
