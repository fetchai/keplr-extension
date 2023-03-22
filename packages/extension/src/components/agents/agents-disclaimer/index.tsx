import closeIcon from "@assets/icon/close-grey.png";
import React, { useEffect, useState } from "react";
import { useStore } from "../../../stores";
import style from "./style.module.scss";

export const AgentDisclaimer = () => {
  const { chainStore, accountStore } = useStore();
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;
  const [openDialog, setIsOpendialog] = useState(false);

  useEffect(() => {
    const addresses = localStorage.getItem("fetchAgentDisclaimerSeen") || "";
    if (walletAddress) setIsOpendialog(!addresses.includes(walletAddress));
  }, [walletAddress]);

  const handleClose = () => {
    const addresses = localStorage.getItem("fetchAgentDisclaimerSeen") || "";
    localStorage.setItem(
      "fetchAgentDisclaimerSeen",
      addresses + `[${walletAddress}]`
    );
    setIsOpendialog(false);
  };

  return openDialog ? (
    <>
      <div className={style.overlay} onClick={() => handleClose()} />
      <div className={style.popupContainer}>
        <img
          draggable={false}
          src={closeIcon}
          style={{
            width: "12px",
            height: "12px",
            cursor: "pointer",
            position: "absolute",
            float: "right",
            right: "14px",
            top: "14px",
          }}
          onClick={() => handleClose()}
        />
        <div className={style.infoContainer}>
          <h3>Fetchbot disclaimer</h3>
          <p>
            Fetchbot may be powered by GPT3.5 (same model that powers chatGPT)
            but it has its limitations. Some information might be incorrect but
            Fetchbot is still getting trained to give more accurate responses.
          </p>

          <p>
            Also, we will be retaining your interaction data with Fetchbot for a
            limited time period for training purposes. Thanks for helping us
            improve Fetchbot. Don&apos;t worry, chat with other addresses apart
            from Fetchbot are still e2e encrypted that even we can&apos;t read.
          </p>
        </div>
        <button type="button" onClick={() => handleClose()}>
          Continue
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};
