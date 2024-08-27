interface txTypes {
  [key: string]: string;
}

export const txType: txTypes = {
  ibcTransfer: "IBC Transfer",
  send: "Send Transaction",
  withdrawRewards: "Rewards withdrawal",
  delegate: "Delegation",
  undelegate: "Undelegation",
  redelegate: "Redelegation",
  govVote: "Government Vote",
  nativeBridgeSend: "Bridging",
  approval: "Approve txn",
  createSecret20ViewingKey: "Secret key creation",
};
