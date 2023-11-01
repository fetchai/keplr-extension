import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import pendingIcon from "@assets/icon/awaiting.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import contractIcon from "@assets/icon/contract-grey.png";
import { ITxn } from "@keplr-wallet/stores";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";

const TransactionItem: FunctionComponent<{
  transactionInfo: ITxn;
}> = ({ transactionInfo }) => {
  const { chainStore, accountStore } = useStore();
  const navigate = useNavigate();
  const intl = useIntl();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "success":
        return success;
      case "pending":
        return pendingIcon;
      case "cancelled":
        return cancel;
      default:
        return cancel;
    }
  };

  const getActivityIcon = (type: string | undefined): string => {
    switch (type) {
      case "Send":
        return sendIcon;
      case "ContractInteraction":
        return contractIcon;
      default:
        return sendIcon;
    }
  };

  const handleCancel = async () => {
    await accountInfo.ethereum.cancelTransactionAndBroadcast(transactionInfo);
    navigate(-1);
  };

  const handleSpeedUp = async () => {
    await accountInfo.ethereum.speedUpTransactionAndBroadcast(transactionInfo);
    navigate(-1);
  };

  const displaySpeedupCancelButtons = () => {
    if (transactionInfo.status === "pending") {
      return (
        <div className={style["activityRow"]}>
          <div className={style["activityCol"]} style={{ width: "50%" }}>
            <Button
              size="sm"
              style={{ width: "100%" }}
              onClick={handleCancel}
              color="danger"
            >
              {intl.formatMessage({
                id: "send.button.cancel",
              })}
            </Button>
          </div>
          <div
            className={style["activityCol"]}
            style={{
              width: "50%",
              visibility: transactionInfo.isSpeedUp ? "hidden" : "visible",
            }}
          >
            <Button
              size="sm"
              style={{ width: "100%" }}
              onClick={handleSpeedUp}
              color="success"
            >
              {intl.formatMessage({
                id: "send.button.speedup",
              })}
            </Button>
          </div>
        </div>
      );
    }
  };

  const displayActivity = (status: string, amount: string | undefined) => {
    return (
      <div className={style["activityRow"]}>
        <div className={style["activityCol"]} style={{ width: "15%" }}>
          <img
            src={getActivityIcon(transactionInfo.type)}
            alt={transactionInfo.type}
          />
        </div>
        <div
          className={style["activityCol"]}
          style={{ width: "40%", overflow: "hidden" }}
        >
          {transactionInfo.type}
        </div>
        <div className={style["activityCol"]} style={{ width: "46%" }}>
          {amount + " " + transactionInfo.symbol}
        </div>
        <div className={style["activityCol"]} style={{ width: "7%" }}>
          <img src={getStatusIcon(status)} alt={status} />
        </div>
      </div>
    );
  };

  return chainStore.current.explorerUrl &&
    transactionInfo.status !== "cancelled" &&
    transactionInfo.status !== "failed" ? (
    <div>
      <a
        href={chainStore.current.explorerUrl + "/tx/" + transactionInfo.hash}
        target="_blank"
        rel="noreferrer"
      >
        {displayActivity(transactionInfo.status, transactionInfo.amount)}
      </a>
      {displaySpeedupCancelButtons()}
    </div>
  ) : (
    <div>
      {displayActivity(transactionInfo.status, transactionInfo.amount)}
      {displaySpeedupCancelButtons()}
    </div>
  );
};

export const NativeEthTab = () => {
  const { chainStore, accountStore } = useStore();
  const [hashList, setHashList] = useState<ITxn[]>([]);

  const timer = useRef<NodeJS.Timer>();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const refreshTxList = async () => {
    if (!window.location.href.includes("#/activity") && timer.current) {
      clearInterval(timer.current);
      return;
    }

    let txList = await accountInfo.ethereum.getTxList();
    setHashList(txList);

    await Promise.all(
      txList.map(async (txData, _) => {
        if (txData.status === "pending") {
          await accountInfo.ethereum.checkAndUpdateTransactionStatus(
            txData.hash
          );
          txList = await accountInfo.ethereum.getTxList();
          setHashList(txList);
        }
      })
    );
  };

  useEffect(() => {
    if (!accountInfo.ethereumHexAddress) {
      return;
    }

    refreshTxList();
    if (!timer.current) {
      timer.current = setInterval(() => refreshTxList(), 5000);
    }
  }, [accountInfo.ethereumHexAddress, chainStore.current.chainId]);

  return (
    <React.Fragment>
      {hashList.length > 0 ? (
        <div>
          {hashList.map((transactionInfo, index) => (
            <TransactionItem key={index} transactionInfo={transactionInfo} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}> No activity </p>
      )}
    </React.Fragment>
  );
};
