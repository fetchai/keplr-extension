import React, { useState } from "react";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import { userDetails, setShowAgentDisclaimer } from "@chatStore/user-slice";
import { store } from "@chatStore/index";
import closeIcon from "@assets/icon/close-grey.png";

export const AgentDisclaimer = () => {
  // address book values
  const userState = useSelector(userDetails);
  const [openDialog, setIsOpendialog] = useState(userState.showAgentDisclaimer);

  return openDialog ? (
    <>
      <div
        className={style.overlay}
        onClick={() => {
          setIsOpendialog(false);
          store.dispatch(setShowAgentDisclaimer(false));
        }}
      />
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
          onClick={() => {
            setIsOpendialog(false);
            store.dispatch(setShowAgentDisclaimer(false));
          }}
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
            from Fetchbot are still e2e encrypted that even we can read.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpendialog(false);
            store.dispatch(setShowAgentDisclaimer(false));
          }}
        >
          Continue
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};
