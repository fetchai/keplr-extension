import { ApolloClient, gql, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { encryptAllData } from "../utils/encrypt-message";
import { store } from "../chatStore";
import { updateAuthorMessages } from "../chatStore/messages-slice";
import client, { createWSLink, httpLink } from "./client";
import { listenMessages, receiveMessages, sendMessages } from "./messages-queries";


export const fetchMessages = async () => {
  const state = store.getState();
 console.log("state access token ",state.user.accessToken);
 
  
  const { data } = await client.query({
    query: gql(receiveMessages),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    },
  });
  console.log("fetchMessages fetchMessages fetchMessages", data);

  return data.mailbox.messages;
};

export const delieverMessages = async (newMessage: any, targetPubKey: string, senderAddress: string) => {
  const state = store.getState();
  try {
    if (newMessage) {
      const encryptedData = await encryptAllData(newMessage, targetPubKey, senderAddress);
      // console.log("new token ",state.user.accessToken);
      
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
            Authorization: `Bearer ${state.user.accessToken}`,
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
  const state = store.getState();
  const wsLink = createWSLink(state.user.accessToken);
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
          authorization: `Bearer ${state.user.accessToken}`,
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

