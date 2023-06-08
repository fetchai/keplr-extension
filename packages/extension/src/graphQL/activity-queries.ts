export const transactions = `query TransactionsFromAddress($after: Cursor, $address: String) {
  transactions(
    after: $after
    first: 30
    filter: {signerAddress: {equalTo:$address}}
    orderBy: TRANSACTIONS_BY_BLOCK_HEIGHT_DESC
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      id
      signerAddress
      status
      messages {
        nodes {
          typeUrl
          json
        }
      }
    }
  }
}`;

export const blocks = `query LatestBlock {
  blocks(first: 1, orderBy: TIMESTAMP_DESC) {
    nodes {
      timestamp
      height
    }
  }
}`;
