import style from "./style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import stakeIcon from "@assets/icon/stake-grey.png";
import contractIcon from "@assets/icon/contract-grey.png";
import claimIcon from "@assets/icon/claim-grey.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import React from "react";
import { formatActivityHash } from "@utils/format";
import { AppCurrency } from "@keplr-wallet/types";
import { useStore } from "../../stores";

const getActivityIcon = (type: string): string => {
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

const getHash = (node: any): any => {
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
      return formatActivityHash(node.id);
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Success":
      return success;
    case "Error":
      return cancel;
    default:
      return cancel;
  }
};

const shortenNumber = (value: string, decimal = 18) => {
  const number = parseFloat(value) / 10 ** decimal;
  let result = "";
  if (number >= 1000000) {
    result = (number / 1000000).toFixed(2) + " M";
  } else if (number >= 1000) {
    result = (number / 1000).toFixed(2) + " K";
  } else if (number >= 1) {
    result = number.toFixed(2) + " ";
  } else if (number >= 10 ** -3) {
    result = (number * 1000).toFixed(2) + " m";
  } else if (number >= 10 ** -6) {
    result = (number * 10 ** 6).toFixed(2) + " u";
  } else if (number >= 10 ** -9) {
    result = (number * 10 ** 9).toFixed(2) + " n";
  } else if (number >= 10 ** -12) {
    result = (number * 10 ** 9).toFixed(3) + " n";
  } else if (number >= 10 ** -15) {
    result = (number * 10 ** 9).toFixed(6) + " n";
  } else result = number.toFixed(2) + " ";
  return result;
};

export const ActivityRow = ({ node }: { node: any }) => {
  const { chainStore } = useStore();

  const getAmount = (data: any) => {
    const amountCurrency = chainStore.current.currencies.find(
      (currency: AppCurrency) => currency.coinMinimalDenom === data.denom
    );
    if (amountCurrency) {
      const amountValue = shortenNumber(
        data.amount,
        amountCurrency?.coinDecimals
      );

      return `${amountValue}${amountCurrency.coinDenom}`;
    } else return `${data.amount} ${data.denom}`;
  };

  const getDetails = (node: any): any => {
    const { nodes } = node.messages;
    const { typeUrl, json } = nodes[0];
    if (typeUrl == "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward")
      return "Reward Claimed";
    else if (json) {
      console.log(json);
      const parsedJson = JSON.parse(json);
      console.log(parsedJson);
      switch (typeUrl) {
        case "/cosmos.bank.v1beta1.MsgSend":
          return getAmount(parsedJson.amount[0]) + " Sent";
        case "/cosmwasm.wasm.v1.MsgExecuteContract":
        case "/cosmos.authz.v1beta1.MsgRevoke":
          if (parsedJson.token) {
            return getAmount(parsedJson.token) + " Spent";
          } else if (parsedJson.amount && parsedJson.amount[0]) {
            return getAmount(parsedJson.amount[0]) + " Spent";
          } else {
            return "Contract Interaction";
          }
        case "/ibc.applications.transfer.v1.MsgTransfer":
          if (parsedJson.token) {
            return getAmount(parsedJson.token) + " Transfered";
          } else if (parsedJson.amount && parsedJson.amount[0]) {
            return getAmount(parsedJson.amount[0]) + " Transfered";
          } else {
            return "Contract Interaction";
          }
        case "/cosmos.staking.v1beta1.MsgDelegate":
          if (parsedJson.amount)
            return <span>-{getAmount(parsedJson.amount)} Staked</span>;
          else return "Stake Operation";

        case "/cosmos.staking.v1beta1.MsgUndelegate":
          if (parsedJson.amount)
            return <span>+{getAmount(parsedJson.amount)} Unstaked</span>;
          else return "Unstake Operation";

        default:
          return "Contract Interaction";
      }
    }
    return "Contract Interaction";
  };
  const details = getDetails(node);
  const hash = getHash(node);
  const { typeUrl } = node.messages.nodes[0];
  return (
    <a
      href={"https://explore.fetch.ai/transactions/" + node.id}
      target="_blank"
      rel="noreferrer"
    >
      <div className={style.activityRow}>
        <div className={style.activityCol} style={{ width: "7%" }}>
          <img src={getActivityIcon(typeUrl)} alt={typeUrl} />
        </div>
        <div className={style.activityCol} style={{ width: "33%" }}>
          {hash}
        </div>
        <div className={style.activityCol} style={{ width: "53%" }}>
          {details}
        </div>
        <div className={style.activityCol} style={{ width: "7%" }}>
          <img src={getStatusIcon(node.status)} alt={node.status} />
        </div>
      </div>
    </a>
  );
};
