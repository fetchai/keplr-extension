import classnames from "classnames";
import React from "react";
import { Container } from "reactstrap";
import deliveredIcon from "../../public/assets/icon/delivered.png";
import style from "./style.module.scss";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  return hours + ":" + minutes.substr(-2);
};

export const ChatMessage = ({
  message,
  isSender,
  timestamp,
}: {
  isSender: boolean;
  message: string;
  timestamp: number;
}) => {
  return (
    <div className={isSender ? style.senderAlign : ""}>
      <Container
        fluid
        className={classnames(style.messageBox, {
          [style.senderBox]: isSender,
        })}
      >
        <div className={style.message}>{message}</div>
        <div className={style.timestamp}>
          {formatTime(timestamp)}
          {isSender && <img src={deliveredIcon} />}
        </div>
      </Container>
    </div>
  );
};
