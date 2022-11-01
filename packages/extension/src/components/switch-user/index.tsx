import React, { useState } from "react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router";
import { NotificationPopup } from "./notification-popup";
import style from "./style.module.scss";

export const SwitchUser: FunctionComponent = () => {
  const history = useHistory();
  const [notification, setNotification] = useState(false)
  const [isUnread, setIsUnread] = useState(true)
  const handleClick = () => {
    setNotification(!notification)
    setIsUnread(false)
  }

  return (
    <div
      style={{
        height: "64px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingRight: "20px",
      }}
    >
      <div
        style={{ cursor: "pointer", display: "flex", flexDirection: "row" }}
        onClick={(e) => {
          e.preventDefault();

          history.push("/setting/set-keyring");
        }}
      >
        <i className="fa fa-user" aria-hidden="true" />
      </div>
      <div onClick={handleClick}>
        <div className={isUnread ? style.unread : ""}></div>
        <img
          src={require("../../public/assets/svg/bell.svg")}
          style={{ width: "20px", marginLeft: "10px", cursor: "pointer" }}
          alt="bell"
        />
      </div>
      {notification && <NotificationPopup />}
    </div>
  );
};
