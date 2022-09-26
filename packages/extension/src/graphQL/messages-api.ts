import { ApolloClient, gql, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { encryptAllData } from "../utils/encrypt-message";
import { store } from "../chatStore";
import { updateAuthorMessages } from "../chatStore/messages-slice";
import client, { createWSLink, httpLink } from "./client";
import { listenMessages, receiveMessages, sendMessages } from "./messages-queries";


const state = store.getState();
export const fetchMessages = async () => {
 
  
  const { data } = await client.query({
    query: gql(receiveMessages),
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImF1ZCI6ImZldGNoYWktaGFzdXJhLWdyYXBocWwiLCJleHAiOjE2NjQyNTYyMzMsImhhc3VyYSI6eyJjbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhbm9ueW1vdXMiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYW5vbnltb3VzIiwieC1oYXN1cmEtb3JnLWlkIjoiYXV0aF9zZXJ2ZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMCJ9fSwiaWF0IjoxNjY0MTY5ODMzLCJpc3MiOiJodHRwczovL2ZldGNoLmFpIiwibmFtZSI6ImZldGNoMTB1M2Vqd2VudGtrdjRjODN5Y2N5M3Q3c3lqM3JnZGM5a2w0bHNjIiwicHVia2V5IjoiMDIzMjY5YzBhOWVmMjU5N2U3MzkxNzE4ODdkNjJmZDQ2YzQ5NmI0YzFlZjczYWY0MWU3MmYwNmU5ZDE3ZmZjOWMxIiwic3ViIjoiSGFzdXJhQWNjZXNzIn0.eBxx10A-tS-yH___67r0sBUDiVRYewjOL9V6gZwuj2Q`,
      },
    },
  });
  console.log("fetchMessages fetchMessages fetchMessages", data);

  return data.mailbox.messages;
};

export const delieverMessages = async (newMessage: any, targetPubKey: string, senderAddress: string) => {
  // const state = store.getState();
  try {
    if (newMessage) {
      const encryptedData = await encryptAllData(newMessage, targetPubKey, senderAddress);
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
