import React, { FunctionComponent } from "react";
import "./ledger-guide-box.module.scss";
import style from "./ledger-guide-box.module.scss";
import classnames from "classnames";

interface LedgerBoxProps {
  title: string;
  message: string;
  isWarning: boolean;
}

export const LedgerBox: FunctionComponent<LedgerBoxProps> = ({
  title,
  message,
  isWarning,
}) => {
  return (
    <div className={classnames(style["ledger-guide-box"])}>
      <div className={style["ledger-guide-content"]}>
        <span
          className={
            isWarning
              ? style["ledger-guide-error-title"]
              : style["ledger-guide-title"]
          }
        >
          {title}
        </span>
      </div>
      <div className={style["ledger-guide-message"]}>{message}</div>
    </div>
  );
};
