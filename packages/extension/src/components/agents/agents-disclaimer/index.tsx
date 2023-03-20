import React, { useState } from "react";
import style from "./style.module.scss";

export const AgentDisclaimer = () => {
  // address book values
  const [openDialog, setIsOpendialog] = useState(true);

  return openDialog ? (
    <>
      <div className={style.overlay} onClick={() => setIsOpendialog(false)} />
      <div className={style.popupContainer}>
        <i
          className={"fa fa-times"}
          style={{
            width: "24px",
            height: "24px",
            cursor: "pointer",
            position: "absolute",
            float: "right",
            right: "0px",
            top: "10px",
          }}
          aria-hidden="true"
          onClick={() => setIsOpendialog(false)}
        />
        <div className={style.infoContainer}>
          <h2 style={{ color: "#3B82F6", margin: "15px", textAlign: "center" }}>
            Fetchbot disclaimer
          </h2>
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
        <button type="button" onClick={() => setIsOpendialog(false)}>
          Continue
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};
