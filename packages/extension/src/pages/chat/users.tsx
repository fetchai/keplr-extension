import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { decryptMessage } from "../../utils/decrypt-message";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";

interface UsersProps {
  userChats: any;
}

const User = ({ chat, contact }: { chat: any; contact: string }) => {
  console.log("contact", contact, "chat", chat);

  const [message, setMessage] = useState("");
  const history = useHistory();
  const handleClick = () => {
    history.push(`/chat/${contact}`);
  };

  useEffect(() => {
    decryptMsg(chat.contents, chat.target === contact);
  }, [chat.contents, chat.target, contact]);

  const decryptMsg = async (contents: string, isSender: boolean) => {
    const message: any = await decryptMessage(contents, isSender);
    console.log("decrypted message", message);

    setMessage(message);
  };

  return (
    <div className={style.messageContainer} onClick={handleClick}>
      <div className={style.initials}>
        {contact.charAt(0).toUpperCase()}
        {!false && <div className={style.unread} />}
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{formatAddress(contact)}</div>
        <div className={style.messageText}>{message}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
      </div>
    </div>
  );
};

export const Users = ({ userChats }: UsersProps) => {
  return (
    <div className={style.messagesContainer}>
      {Object.keys(userChats).length ? (
        Object.keys(userChats).map((contact, index) => (
          <User key={index} chat={userChats[contact]} contact={contact} />
        ))
      ) : (
        <div>
          <div className={style.resultText}>testing No result found</div>
          <button>Add new contact to address book</button>
        </div>
      )}
    </div>
  );
};
