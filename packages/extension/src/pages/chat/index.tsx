import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "../../layouts";
import bellIcon from "../../public/assets/icon/bell.png";
import searchIcon from "../../public/assets/icon/search.png";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import style from "./style.module.scss";

const User = ({
  name,
  message,
  isSeen,
}: {
  name: string;
  message: string;
  isSeen: boolean;
}) => {
  return (
    <div className={style.messageContainer}>
      <div className={style.initials}>
        {name.charAt(0).toUpperCase()}
        {!isSeen && <div className={style.unread} />}
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{name}</div>
        <div className={style.messageText}>{message}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "100%" }} alt="message" />
      </div>
    </div>
  );
};

const usersData = [
  {
    name: "Someone",
    message: "Hi there",
    iseSeen: false,
    timestamp: "",
  },
  {
    name: "Someone",
    message: "Did you review my PR?",
    iseSeen: false,
    timestamp: "",
  },
  {
    name: "Billy",
    message: "Is there a public key string or hex representation?",
    iseSeen: true,
    timestamp: "",
  },
];

export const Chat: FunctionComponent = () => {
  const history = useHistory();
  const [users, setUsers] = useState(usersData);
  const [inputVal, setInputVal] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (e.target.value.trim().length) {
      const filterdUser = usersData.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setUsers(filterdUser);
    } else {
      setUsers(usersData);
    }
  };

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      onBackButton={() => {
        history.goBack();
      }}
      rightRenderer={
        <div
          style={{
            height: "64px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingRight: "20px",
          }}
        >
          <img
            src={bellIcon}
            alt="notification"
            style={{ width: "16px", cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();

              history.push("/setting/set-keyring");
            }}
          />
        </div>
      }
    >
      <div>
        {/* Searching */}
        <div className={style.searchContainer}>
          <div className={style.searchBox}>
            <img src={searchIcon} alt="search" />
            <input
              placeholder="Search by name or address"
              value={inputVal}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Messages history */}
        <div className={style.messagesContainer}>
          {users.map((user, index) => (
            <User
              key={index}
              name={user.name}
              message={user.message}
              isSeen={user.iseSeen}
            />
          ))}
        </div>
      </div>
    </HeaderLayout>
  );
};
