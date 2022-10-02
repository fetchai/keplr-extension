import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { MESSAGING_SERVER } from "../config.ui.var";

export const client = new ApolloClient({
  uri: MESSAGING_SERVER,
  cache: new InMemoryCache(),
});

export const httpLink = new HttpLink({
  uri: MESSAGING_SERVER,
});

export const createWSLink = (token: string) => {
  return new GraphQLWsLink(
    createClient({
      // url: "ws://localhost:4000/subscription",
      url: "ws://messaging-server.sandbox-london-b.fetch-ai.com/subscription",
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
      on: {
        connecting: () => {
          console.log("connecting");
        },
        opened: () => {
          console.log("opened");
        },
      },
    })
  );
};
