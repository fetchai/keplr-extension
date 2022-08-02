import React from "react";
import { Button } from "reactstrap";

import style from "./style.module.scss";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { useHistory } from "react-router";

const formatAddress = (address: string, length: number) => {
  const sublength = length / 2;
  if (address.length > length)
    return (
      address.substring(0, sublength) +
      "..." +
      address.substring(address.length - sublength, address.length)
    );
  else return address;
};

interface UserMessage {
  name: string;
  message: string;
  iseSeen: boolean;
  timestamp: string;
}

interface UsersProps {
  users: UserMessage[];
}

const User = ({
  name,
  message,
  isSeen,
}: {
  name: string;
  message: string;
  isSeen: boolean;
}) => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/chat/${name}`);
  };
  return (
    <div className={style.messageContainer} onClick={handleClick}>
      <div className={style.initials}>
        {name.charAt(0).toUpperCase()}
        {!isSeen && <div className={style.unread} />}
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{formatAddress(name, 10)}</div>
        <div className={style.messageText}>{message}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "100%" }} alt="message" />
      </div>
    </div>
  );
};

export const Users = ({ users }: UsersProps) => {
  return (
    <div className={style.messagesContainer}>
      {users.length ? (
        users.map((user, index) => (
          <User
            key={index}
            name={user.name}
            message={user.message}
            isSeen={user.iseSeen}
          />
        ))
      ) : (
        <div>
          <div className={style.resultText}>No result found</div>
          <Button color="primary">Add new contact to address book</Button>
        </div>
      )}
    </div>
  );
};
