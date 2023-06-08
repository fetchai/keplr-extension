import style from "../pages/activity/style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import stakeIcon from "@assets/icon/stake-grey.png";
import contractIcon from "@assets/icon/contract-grey.png";
import claimIcon from "@assets/icon/claim-grey.png";
import awaiting from "@assets/icon/awaiting.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";

export const getAmountClass = (amount: string): string => {
  return amount.charAt(0) === "-"
    ? style.negative
    : amount.charAt(0) === "+"
    ? style.positive
    : style.col;
};

export const getImageSource = (type: string): string => {
  switch (type) {
    case "send":
      return sendIcon;
    case "stake":
      return stakeIcon;
    case "contract":
      return contractIcon;
    case "claim":
      return claimIcon;
    default:
      return "";
  }
};

export const getStatusImageSource = (status: string): string => {
  switch (status) {
    case "awaiting":
      return awaiting;
    case "success":
      return success;
    case "cancel":
      return cancel;
    default:
      return "";
  }
};
