import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "../../layouts";
import bellIcon from "../../public/assets/icon/bell.png";
import searchIcon from "../../public/assets/icon/search.png";
import style from "./style.module.scss";
import { Users } from "./users";
import { Menu } from "../main/menu";

const usersData = [
  {
    name: "Bryan",
    message: "Hi there",
    iseSeen: false,
    timestamp: "",
  },
  {
    name: "Patrick",
    message: "Did you get the token details",
    iseSeen: false,
    timestamp: "",
  },
  {
    name: "Billy",
    message: "Are the transactions ",
    iseSeen: true,
    timestamp: "",
  },
  {
    name: "fetch1qy3z4lpw3sc2wyvmnrnjthhppkjg3g4ajz8kab",
    message: "Is there a public key string or hex representation?",
    iseSeen: true,
    timestamp: "",
  },
  {
    name: "fetch1qy3z4lpw3sc2wyvmnrnjthhppkjg3g4ajz8kcd",
    message: "that somebody wrote okay so ...",
    iseSeen: true,
    timestamp: "",
  },
  {
    name: "fetch1qy3z4lpw3sc2wyvmnrnjthhppkjg3g4ajz8kef",
    message: "here's the placeholder message ",
    iseSeen: true,
    timestamp: "",
  },
];

const ChatView = () => {
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
    <div className={style.chatContainer}>
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
      <Users users={users} />
    </div>
  );
};

export const ChatPage: FunctionComponent = () => {
  const history = useHistory();

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      menuRenderer={<Menu />}
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
      <ChatView />
    </HeaderLayout>
  );
};
