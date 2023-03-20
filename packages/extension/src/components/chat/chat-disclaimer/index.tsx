import privacyIcon from "@assets/hello.png";
import { userDetails } from "@chatStore/user-slice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import style from "./style.module.scss";

export const ChatDisclaimer = () => {
  const userState = useSelector(userDetails);
  const [openDialog, setIsOpendialog] = useState(!userState.accessToken.length);
  const history = useHistory();
  const handleClick = async () => {
    setIsOpendialog(false);
    history.push("/chat");
  };

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

        <img draggable={false} src={privacyIcon} />
        <br />
        <div className={style.infoContainer}>
          <h3>Chat is now free for a limited time!</h3>
          <p>
            Previously you would need some FET balance to be able to use this
            feature but we have made it free specially for you to play around.
          </p>
        </div>
        <button type="button" onClick={handleClick}>
          Got To Chat
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};
