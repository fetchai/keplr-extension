import React from "react";
import style from "./style.module.scss";

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
          <h2 style={{ color: "#3B82F6", margin: "15px", textAlign: "center" }}>
            Agents can do more!!
          </h2>
          <p>Type / to access a list of commands such as .....</p>
          <div
            style={{
              height: "120px",
              borderRadius: "10px",
              background: "#D9D9D9",
              marginBottom: "10px",
            }}
          />
          <p>You can also...</p>
          <div
            style={{
              height: "120px",
              borderRadius: "10px",
              background: "#D9D9D9",
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
