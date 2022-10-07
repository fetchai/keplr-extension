import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { decryptMessage } from "../../utils/decrypt-message";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";
import { MessageMap } from "../../chatStore/messages-slice";

const User: React.FC<{
  chainId: string;
  chat: any;
  contact: string;
  contactName: string;
}> = ({ chainId, chat, contact, contactName }) => {
  const [message, setMessage] = useState("");
  const history = useHistory();
  const handleClick = () => {
    history.push(`/chat/${contact}`);
  };

  useEffect(() => {
    decryptMsg(chainId, chat.contents, chat.sender === contact);
  }, [chainId, chat.contents, chat.sender, contact]);

  const decryptMsg = async (
    chainId: string,
    contents: string,
    isSender: boolean
  ) => {
    const message = await decryptMessage(chainId, contents, isSender);
    setMessage(message);
  };

  return (
    <div className={style.messageContainer} onClick={handleClick}>
      <div className={style.initials}>
        {contact.charAt(0).toUpperCase()}
        {!false && <div className={style.unread} />}
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
  name: string;
  address: string;
}

export const Users: React.FC<{
  chainId: string;
  userChats: MessageMap;
  addresses: NameAddress[];
}> = ({ chainId, userChats, addresses }) => {
  return (
    <div className={style.messagesContainer}>
      {Object.keys(userChats).length ? (
        Object.keys(userChats).map((contact, index) => {
          // translate the contact address into the address book name if it exists
          const contactAddressBookName = addresses.find(
            (entry) => entry.address === contact
          )?.name;

          return (
            <User
              key={index}
              chat={userChats[contact]}
              contact={contact}
              contactName={contactAddressBookName ?? formatAddress(contact)}
              chainId={chainId}
            />
          );
        })
      ) : (
        <div>
          <div className={style.resultText}>No result found</div>
        </div>
      )}
    </div>
  );
};
