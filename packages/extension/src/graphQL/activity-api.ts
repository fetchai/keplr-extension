import { gql } from "@apollo/client";
import { blocks, transactions } from "./activity-queries";
import { activityClient } from "./client";

export const fetchTransactions = async (after: string, address: string) => {
  const variables: any = {
    after,
    address,
  };

  const { data, errors } = await activityClient.query({
    query: gql(transactions),
    fetchPolicy: "no-cache",
    variables,
  });

  if (errors) console.log("errors", errors);

  return data.transactions;
};

export const fetchLatestBlock = async () => {
  const { data, errors } = await activityClient.query({
    query: gql(blocks),
    fetchPolicy: "no-cache",
  });

  if (errors) console.log("errors", errors);

  return data.blocks.nodes[0].height;
};
