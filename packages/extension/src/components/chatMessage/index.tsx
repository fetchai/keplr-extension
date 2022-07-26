import React from "react";
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
      <div className={`messageBox ${isSender ? style.senderBox : ""}`}>
        <span className={`messageText ${isSender ? style.senderText : ""}`}>
          {message}
        </span>
      </div>
    </div>
  );
};
