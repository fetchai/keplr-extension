import React from "react";
import { FunctionComponent } from "react";

interface Props {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  showNotifications: boolean;
}
export const ShowNotification: FunctionComponent<Props> = (props) => {
  return (
    <div
      style={{
        height: "64px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div
        style={{ width: "16px", cursor: "pointer", margin: "0 2.5vw" }}
        onClick={(e) => {
          e.preventDefault();

          props.setShowNotifications(!props.showNotifications);
        }}
      >
        <img
          src={require("@assets/svg/bell-icon.svg")}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
