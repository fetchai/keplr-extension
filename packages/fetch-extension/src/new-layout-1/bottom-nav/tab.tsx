import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
// import { ToolTip } from "@components/tooltip";

import style from "./style.module.scss";
import { useStore } from "../../stores";

interface TabProps {
  title: string;
  icon: string;
  path: string;
  disabled: boolean;
  tooltip?: string;
}

export const Tab = ({ title, icon, path, disabled, tooltip }: TabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { analyticsStore } = useStore();

  const isChatActive =
    title == "Chat" &&
    (location.pathname == "/new-chat" ||
      location.pathname.startsWith("/chat/"));
  const isActive = path === location.pathname || isChatActive;

  return (
    <div
      id={title}
      style={{ backgroundColor: "#000D3D" }}
      className={`${style["tab"]} `}
      onClick={() => {
        if (!disabled) {
          if (path !== "/") {
            analyticsStore.logEvent(`${title} tab click`);
          }
          navigate(path);
        }
      }}
    >
      <div
        className={`${style["tab-icon"]} ${
          isActive ? style["active"] : disabled ? style["disabled"] : null
        }`}
      >
        <img draggable={false} src={icon} alt="tab" />
      </div>
      <div className={style["title"]}>{title}</div>
      {disabled && (
        <UncontrolledTooltip placement="top" target={title}>
          {tooltip}
        </UncontrolledTooltip>
      )}
    </div>
  );
};
