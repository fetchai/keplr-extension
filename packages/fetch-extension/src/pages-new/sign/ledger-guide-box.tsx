import React, { FunctionComponent } from "react";
import "./ledger-guide-box.module.scss";
import style from "./ledger-guide-box.module.scss";
import classnames from "classnames";

interface LedgerBoxProps {
  isWarning: boolean;
  title: string;
  message: string;
}

export const LedgerBox: FunctionComponent<LedgerBoxProps> = ({
  isWarning,
  title,
  message,
}) => {
  return (
    <div
      className={classnames(style["ledger-guide-box"], {
        [style["ledger-guide-warning-bg"]]: isWarning,
        [style["ledger-guide-blur-bg"]]: !isWarning,
      })}
    >
      <div className={style["ledger-guide-content"]}>
        <span className={style["ledger-guide-title"]}>{title}</span>
      </div>
      <div className={style["ledger-guide-message"]}>{message}</div>
    </div>
  );
};
