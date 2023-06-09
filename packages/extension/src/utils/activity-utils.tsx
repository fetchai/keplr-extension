import sendIcon from "@assets/icon/send-grey.png";
import stakeIcon from "@assets/icon/stake-grey.png";
import contractIcon from "@assets/icon/contract-grey.png";
import claimIcon from "@assets/icon/claim-grey.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import React from "react";
import { formatActivityHash } from "@utils/format";

export const getActivityIcon = (type: string): string => {
  switch (type) {
    case "/cosmos.bank.v1beta1.MsgSend":
      return sendIcon;
    case "/cosmos.staking.v1beta1.MsgDelegate":
    case "/cosmos.staking.v1beta1.MsgUndelegate":
      return stakeIcon;
    case "contract":
      return contractIcon;
    case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
      return claimIcon;
    default:
      return contractIcon;
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Success":
      return success;
    case "Error":
      return cancel;
    default:
      return cancel;
  }
};

export const getDetails = (node: any): any => {
  const { nodes } = node.messages;

  for (const message of nodes) {
    const { typeUrl, json } = message;
    switch (typeUrl) {
      case "/cosmos.bank.v1beta1.MsgSend":
        if (json) {
          const parsedJson = JSON.parse(json);
          if (parsedJson.amount && Array.isArray(parsedJson.amount)) {
            return parsedJson.amount.map((item: any) => (
              <div>
                <span style={{ color: "red" }}>-</span>
                {item.amount} {item.denom}
              </div>
            ));
          }
        }
        break;

      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
        return "Reward Claimed";

      case "/cosmwasm.wasm.v1.MsgExecuteContract":
      case "/cosmos.authz.v1beta1.MsgRevoke":
      case "/ibc.applications.transfer.v1.MsgTransfer":
        if (json.token) {
          return `${json.token.amount}${json.token.denom}`;
        }
        if (json) {
          const parsedJson = JSON.parse(json);
          console.log("aaaa", parsedJson);
          if (parsedJson.amount) {
            return parsedJson.amount.map((item: any) => (
              <div>
                {item.amount} {item.denom}
              </div>
            ));
          } else {
            return "Contract Interaction";
          }
        }
        break;

      case "/cosmos.staking.v1beta1.MsgDelegate":
        if (json) {
          const parsedJson = JSON.parse(json);
          if (parsedJson.amount && typeof parsedJson.amount === "object") {
            return (
              <div>
                <span style={{ color: "green" }}>+</span>
                {parsedJson.amount.amount} {parsedJson.amount.denom}
              </div>
            );
          }
        }
        break;
      case "/cosmos.staking.v1beta1.MsgUndelegate":
        if (json) {
          const parsedJson = JSON.parse(json);
          if (parsedJson.amount && typeof parsedJson.amount === "object") {
            return (
              <div>
                <span style={{ color: "red" }}>-</span>
                {parsedJson.amount.amount} {parsedJson.amount.denom}
              </div>
            );
          }
        }
        break;

      default:
        return null;
    }
  }

  return null;
};

export const getHash = (node: any): any => {
  const { typeUrl, json } = node.messages.nodes[0];

  switch (typeUrl) {
    case "/cosmos.bank.v1beta1.MsgSend":
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
    case "/cosmos.authz.v1beta1.MsgRevoke":
    case "/ibc.applications.transfer.v1.MsgTransfer":
      return formatActivityHash(node.id) || null;
    case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
      return formatActivityHash(JSON.parse(json).validatorAddress) || null;
    case "/cosmos.staking.v1beta1.MsgDelegate":
    case "/cosmos.staking.v1beta1.MsgUndelegate":
      return formatActivityHash(JSON.parse(json).validatorAddress) || null;
    default:
      return null;
  }
};

