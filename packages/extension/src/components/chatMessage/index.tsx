import React from "react";
import classnames from "classnames";
import style from "./style.module.scss";

export const ChatMessage = ({
  message,
  isSender,
}: {
  isSender: boolean;
  message: string;
}) => {
  return (
    <div className={isSender ? style.senderAlign : ""}>
      <div
        className={classnames(style.messageBox, {
          [style.senderBox]: isSender,
        })}
      >
        <span
          className={classnames(style.messageText, {
            [style.senderText]: isSender,
          })}
        >
          {message}
        </span>
      </div>
    </div>
  );
};
