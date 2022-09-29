import { ApolloClient, gql, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { encryptAllData } from "../utils/encrypt-message";
import { store } from "../chatStore";
import { updateAuthorMessages } from "../chatStore/messages-slice";
import client, { createWSLink, httpLink } from "./client";
import { listenMessages, receiveMessages, sendMessages } from "./messages-queries";

export const fetchMessages = async (accessToken: string) => {
  // const state = store.getState();
  const { data } = await client.query({
    query: gql(receiveMessages),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  console.log("fetchMessages", data);

  return data.mailbox.messages;
};

export const delieverMessages = async (chainId: string, newMessage: any, senderAddress: string, targetAddress: string) => {
  // const state = store.getState();
  try {
    if (newMessage) {
      const encryptedData = await encryptAllData(chainId, newMessage, senderAddress, targetAddress);
      const { data } = await client.mutate({
        mutation: gql(sendMessages),
        variables: {
          messages: [
            {
              contents: `${encryptedData}`,
            },
          ],
        },
        context: {
          headers: {
            Authorization: `Bearer fagf`,
          },
        },
      });
      return data;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const messageListener = () => {
  // const state = store.getState();
  const wsLink = createWSLink("Fake Token");
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink
  );
  const newClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  newClient
    .subscribe({
      query: gql(listenMessages),
      context: {
        headers: {
          authorization: `Bearer asd`,
        },
      },
    })
    .subscribe({
      next({ data }) {
        //call update messages function
        console.log("messageListener", data);
        store.dispatch(updateAuthorMessages(data.newMessageUpdate.message));
      },
      error(err) {
        console.error("err", err);
      },
      complete() {
        console.log("completed");
      },
    });
};

//keys details
/*
  account : fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr
  pub key: 02374e853b83f99f516caef4ee117a63bc90a20a89a0929b8d549f46568c63ff65

*/

//keys details
/*
  account : fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc
  pub key: 023269c0a9ef2597e739171887d62fd46c496b4c1ef73af41e72f06e9d17ffc9c1

*/
