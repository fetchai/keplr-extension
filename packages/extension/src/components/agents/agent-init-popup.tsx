import React from "react";
import style from "./style.module.scss";
import commandIcon from "@assets/agent-commands.png";
import gptIcon from "@assets/agent-gpt.png";

export const AgentInitPopup = ({
  setIsOpendialog,
}: {
  setIsOpendialog: any;
}) => {
  // address book values
  return (
    <>
      <div className={style.overlay} />
      <div className={style.popupContainer}>
        <div className={style.infoContainer}>
          <h3 style={{ textAlign: "center" }}>Agents can do more!!</h3>
          <p>Type / to access a list of commands such as</p>
          <img
            src={commandIcon}
            style={{
              height: "120px",
              marginBottom: "10px",
            }}
          />
          <p>You can also...</p>
          <img
            src={gptIcon}
            style={{
              height: "120px",
              marginBottom: "10px",
            }}
          />
        </div>
        <button type="button" onClick={() => setIsOpendialog(false)}>
          Get Started
        </button>
      </div>
    </>
  );
};
