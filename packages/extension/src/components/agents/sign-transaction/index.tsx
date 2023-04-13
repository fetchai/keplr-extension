import { userDetails } from "@chatStore/user-slice";
import { useNotification } from "@components/notification";
import { deliverMessages } from "@graphQL/messages-api";
import { executeTxn } from "@utils/sign-transaction";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { AGENT_ADDRESS, TRANSACTION_FAILED } from "../../../config.ui.var";
import { useStore } from "../../../stores";
import style from "./style.module.scss";

export const SignTransaction = ({
  rawText,
  chainId,
  disabled,
}: {
  rawText: string;
  chainId: string;
  disabled: boolean;
}) => {
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const history = useHistory();
  const targetAddress = history.location.pathname.split("/")[3];

  const user = useSelector(userDetails);
  const notification = useNotification();
  const signTxn = async (data: string) => {
    const payload = JSON.parse(data);
    const messagePayload = {
      chainId,
      accessToken: user.accessToken,
      targetAddress,
    };
    try {
      await executeTxn(accountInfo, notification, payload, messagePayload);
      history.goBack();
    } catch (e) {
      console.log(e);
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: `Failed to execute Transaction`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      await deliverMessages(
        user.accessToken,
        chainId,
        TRANSACTION_FAILED,
        accountInfo.bech32Address,
        targetAddress
      );
      history.push(`/chat/agent/${AGENT_ADDRESS[current.chainId]}`);
    }
  };

  return (
    <div className={style.message}>
      Please recheck parameters of the transaction in Data Tab before approving
      the transaction.
      <button
        type="button"
        disabled={disabled}
        className={style.buttonContainer}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => signTxn(rawText)}
      >
        Sign transaction
      </button>
    </div>
  );
};
