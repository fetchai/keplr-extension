import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
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
}

export const getPubKey = async (
  accessToken: string,
  targetAddress: string,
  channelId: string
): Promise<string | undefined> => {
  try {
    console.log("%%%%", accessToken)
    const { data } = await client.query({
      query: gql(`query Query($address: String!, $channelId: ChannelId!) {
        publicKey(address: $address, channelId: $channelId) {
          publicKey
        }
      }`),
      variables: {
        address: targetAddress,
        channelId
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    return data.publicKey.publicKey;
  } catch (e) {
    console.log(e);
  }
}