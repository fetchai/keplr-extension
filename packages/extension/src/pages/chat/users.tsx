import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { decryptMessage } from "../../utils/decrypt-message";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";

interface UsersProps {
  userChats: any;
  addresses: any;
}

const User = ({
  chat,
  contact,
  contactname,
}: {
  chat: any;
  contact: any;
  contactname: any;
}) => {
  console.log("contact", contact, "chat", chat, "contactname", contactname);

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
        <div className={style.name}>{contactname}</div>
        <div className={style.messageText}>{message}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
      </div>
    </div>
  );
};

export const Users = ({ userChats, addresses }: UsersProps) => {
  // const [addAddressModalOpen,setAddAddressModalOpen]=useState(true)
  const history = useHistory();
  console.log("userChats userChats", userChats, addresses);

  const checkAddress = (addresses: any, contact: string) => {
    let val = "";
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].address == contact) {
        val = addresses[i].name;
      }
    }
    return val;
  };
  return (
    <div className={style.messagesContainer}>
      {Object.keys(userChats).length ? (
        Object.keys(userChats).map((contact, index) => {
          return (
            <User
              key={index}
              chat={userChats[contact]}
              contact={contact}
              contactname={
                checkAddress(addresses, contact).length
                  ? checkAddress(addresses, contact)
                  : formatAddress(contact)
              }
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
