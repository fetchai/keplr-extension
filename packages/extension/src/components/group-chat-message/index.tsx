import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import deliveredIcon from "@assets/icon/chat-unseen-status.png";
import chatSeenIcon from "@assets/icon/chat-seen-status.png";
import style from "./style.module.scss";
import { isToday, isYesterday, format } from "date-fns";
import { decryptGroupMessage } from "../../utils/decrypt-group";
import { GroupMessagePayload, NameAddress } from "@chatTypes";
import { GroupMessageType } from "../../utils/encrypt-group";
import { formatAddress } from "../../utils/format";

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "p");
};

export const GroupChatMessage = ({
  chainId,
  senderAddress,
  addresses,
  message,
  isSender,
  timestamp,
  showDate,
  groupLastSeenTimestamp,
}: {
  chainId: string;
  senderAddress: string;
  addresses: NameAddress;
  isSender: boolean;
  message: string;
  timestamp: number;
  showDate: boolean;
  groupLastSeenTimestamp: number;
}) => {
  const [
    decryptedMessage,
    setDecryptedMessage,
  ] = useState<GroupMessagePayload>();

  // translate the contact address into the address book name if it exists
  const contactAddressBookName = addresses[senderAddress];

  useEffect(() => {
    setDecryptedMessage(decryptGroupMessage(message));
  }, [chainId, message]);

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

  function getContactName(address: string): string {
    return contactAddressBookName
      ? formatAddress(contactAddressBookName)
      : formatAddress(address);
  }

  function removeByIndex(str: string, index: number) {
    return str.slice(0, index) + str.slice(index + 1);
  }

  function getEventMessage(message: string): string {
    const data = message.split(" ");
    const tempAddress = data.find((element) => element.startsWith("-"));
    if (tempAddress) {
      const finalData = message.replace(
        tempAddress,
        getContactName(removeByIndex(tempAddress, 0))
      );
      return finalData;
    }

    return message;
  }

  return (
    <>
      <div className={style.currentDateContainer}>
        {" "}
        {showDate ? (
          <span className={style.currentDate}>{getDate(timestamp)}</span>
        ) : null}
      </div>
      {decryptedMessage &&
      (decryptedMessage.type == GroupMessageType.event.toString() ||
        decryptedMessage.type === GroupMessageType[GroupMessageType.event]) ? (
        <div className={style.currentEventContainer}>
          {" "}
          {
            <span className={style.currentEvent}>
              {getEventMessage(decryptedMessage.message)}
            </span>
          }
        </div>
      ) : (
        <div className={isSender ? style.senderAlign : style.receiverAlign}>
          <Container
            fluid
            className={classnames(style.messageBox, {
              [style.senderBox]: isSender,
            })}
          >
            {!isSender && (
              <div className={style.title}>{getContactName(senderAddress)}</div>
            )}
            {!decryptedMessage ? (
              <i className="fas fa-spinner fa-spin ml-1" />
            ) : (
              <div className={style.message}>{decryptedMessage.message}</div>
            )}
            <div className={style.timestamp}>
              {formatTime(timestamp)}
              {isSender && groupLastSeenTimestamp < timestamp && (
                <img alt="delivered" src={deliveredIcon} />
              )}
              {isSender && groupLastSeenTimestamp >= timestamp && (
                <img alt="seen" src={chatSeenIcon} />
              )}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};
