import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import jazzicon from "@metamask/jazzicon";
import ReactHtmlParser from "react-html-parser";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { decryptMessage } from "../../utils/decrypt-message";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";
import { MessageMap, userMessages } from "../../chatStore/messages-slice";
import { fromBech32 } from "@cosmjs/encoding";
import { useSelector } from "react-redux";

const User: React.FC<{
  chainId: string;
  chat: any;
  contact: string;
  contactName: string;
  isUnread: boolean;
}> = ({ chainId, chat, contact, contactName, isUnread }) => {
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleClick = () => {
    history.push(`/chat/${contact}`);
  };
  const decryptMsg = async (
    chainId: string,
    contents: string,
    isSender: boolean
  ) => {
    const message = await decryptMessage(chainId, contents, isSender);
    setMessage(message);
  };

  useEffect(() => {
    if (chat) decryptMsg(chainId, chat.contents, chat.sender !== contact);
  }, [chainId, chat, contact]);

  return (
    <div
      className={style.messageContainer}
      onClick={handleClick}
      style={{ position: "relative" }}
    >
      {isUnread ? (
        <span
          style={{
            height: "19px",
            width: "19px",
            backgroundColor: "#d027e5",
            borderRadius: "20px",
            position: "relative",
            bottom: "20px",
            left: "3px",
            zIndex: "1000",
            position: "absolute",
          }}
        />
      ) : (
        ""
      )}
      <div className={style.initials}>
        <div>
          {ReactHtmlParser(
            jazzicon(24, parseInt(fromBech32(contact).data.toString(), 16))
              .outerHTML
          )}
        </div>
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{contactName}</div>
        <div className={style.messageText}>{message}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
      </div>
    </div>
  );
};

export interface NameAddress {
  [key: string]: string;
}

export const Users: React.FC<{
  chainId: string;
  userChats: MessageMap;
  addresses: NameAddress;
}> = ({ chainId, userChats, addresses }) => {
  const messages = useSelector(userMessages);

  return (
    <div className={style.messagesContainer}>
      {Object.keys(userChats).length ? (
        Object.keys(userChats).map((contact: any, index) => {
          // translate the contact address into the address book name if it exists
          const contactAddressBookName = addresses[contact];

          const foundMessage =
            messages[`${userChats[contact].sender}-${contact}`];

          return (
            <User
              key={index}
              chat={userChats[contact]}
              contact={contact}
              contactName={
                contactAddressBookName
                  ? formatAddress(contactAddressBookName)
                  : formatAddress(contact)
              }
              chainId={chainId}
              isUnread={
                foundMessage?.targetTimeStamp <
                userChats[contact].commitTimestamp
              }
            />
          );
        })
      ) : (
        <div>
          <div className={style.resultText}>
            No results. Don&apos;t worry you can create a new chat by clicking
            on the icon beside the search box.
          </div>
        </div>
      )}
    </div>
  );
};
