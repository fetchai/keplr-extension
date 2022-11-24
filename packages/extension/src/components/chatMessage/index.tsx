import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import deliveredIcon from "../../public/assets/icon/delivered.png";
import blueCheck from "../../public/assets/icon/double-check.png";
import { decryptMessage } from "../../utils/decrypt-message";
import style from "./style.module.scss";
import { isToday, isYesterday, format } from "date-fns";

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "p");
};

const getDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  if (isToday(d)) {
    return "Today";
  }
  if (isYesterday(d)) {
    return "Yesterday";
  }
  return format(d, "dd MMMM yyyy");
};

export const ChatMessage = ({
  chainId,
  message,
  isSender,
  timestamp,
  showDate,

  targetLastSeenTimestamp,
}: {
  chainId: string;
  isSender: boolean;
  message: string;
  timestamp: number;
  showDate: boolean;

  targetLastSeenTimestamp: number;
}) => {
  const [decryptedMessage, setDecryptedMessage] = useState("");

  useEffect(() => {
    decryptMessage(chainId, message, isSender)
      .then((message) => {
        setDecryptedMessage(message);
      })
      .catch((e) => {
        setDecryptedMessage(e.message);
      });
  }, [chainId, isSender, message]);

  return (
    <>
      <div className={style.currentDateContainer}>
        {" "}
        {showDate ? (
          <span className={style.currentDate}>{getDate(timestamp)}</span>
        ) : null}
      </div>
      <div className={isSender ? style.senderAlign : style.receiverAlign}>
        <Container
          fluid
          className={classnames(style.messageBox, {
            [style.senderBox]: isSender,
          })}
        >
          {!decryptedMessage ? (
            <i className="fas fa-spinner fa-spin ml-1" />
          ) : (
            <div className={style.message}>{decryptedMessage}</div>
          )}
          <div className={style.timestamp}>
            <span>{formatTime(timestamp)}</span>
            {isSender &&
              (targetLastSeenTimestamp >= timestamp ? (
                <img src={blueCheck} height={10} width={14} />
              ) : (
                <img alt="" src={deliveredIcon} />
              ))}
          </div>
        </Container>
      </div>
    </>
  );
};
