import { ApolloClient, gql, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { store } from "../chatStore";
import {
  setBlockedList,
  setBlockedUser,
  setUnblockedUser,
  updateAuthorMessages,
} from "../chatStore/messages-slice";
import { encryptAllData } from "../utils/encrypt-message";
import { client, createWSLink, httpLink } from "./client";
import {
  block,
  blockedList,
  listenMessages,
  NewMessageUpdate,
  receiveMessages,
  sendMessages,
  unblock,
} from "./messages-queries";

export const fetchMessages = async () => {
  const state = store.getState();
  const { data, errors } = await client.query({
    query: gql(receiveMessages),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    },
  });
  if (errors) console.log("errors", errors);

  return data.mailbox.messages;
};

export const fetchBlockList = async () => {
  const state = store.getState();
  const { data } = await client.query({
    query: gql(blockedList),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    },
    variables: {
      channelId: "MESSAGING",
    },
  });
  console.log(data);
  store.dispatch(setBlockedList(data.blockedList));
};

export const blockUser = async (address: string) => {
  const state = store.getState();
  const { data } = await client.mutate({
    mutation: gql(block),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    },
    variables: {
      blockedAddress: address,
      channelId: "MESSAGING",
    },
  });
  store.dispatch(setBlockedUser(data.block));
};

export const unblockUser = async (address: string) => {
  const state = store.getState();
  const { data } = await client.mutate({
    mutation: gql(unblock),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    },
    variables: {
      blockedAddress: address,
      channelId: "MESSAGING",
    },
  });
  store.dispatch(setUnblockedUser(data.unblock));
};

export const deliverMessages = async (
  accessToken: string,
  chainId: string,
  newMessage: any,
  senderAddress: string,
  targetAddress: string
) => {
  const state = store.getState();
  try {
    if (newMessage) {
      const encryptedData = await encryptAllData(
        accessToken,
        chainId,
        newMessage,
        senderAddress,
        targetAddress
      );
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
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
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
      next({ data }: { data: { newMessageUpdate: NewMessageUpdate } }) {
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
