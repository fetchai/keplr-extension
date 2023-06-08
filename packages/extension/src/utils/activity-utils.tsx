import style from "../pages/activity/style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import stakeIcon from "@assets/icon/stake-grey.png";
import contractIcon from "@assets/icon/contract-grey.png";
import claimIcon from "@assets/icon/claim-grey.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";

export const getAmountClass = (amount: string): string => {
  return amount.charAt(0) === "-"
    ? style.negative
    : amount.charAt(0) === "+"
    ? style.positive
    : style.col;
};

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
