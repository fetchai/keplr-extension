import { WalletConfig } from "./config-queries";
import { gql } from "@apollo/client";
import { client } from "./client";

export const getWalletConfig = async () => {
  const { data, errors } = await client.query({
    query: gql(WalletConfig),
    fetchPolicy: "no-cache",
  });

  if (errors) console.log("errors", errors);
  return data.walletConfig;
};
