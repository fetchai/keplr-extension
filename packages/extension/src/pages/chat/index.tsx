import React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import chatIcon from "../../public/assets/hello.png";
import newChatIcon from "../../public/assets/icon/new-chat.png";
import searchIcon from "../../public/assets/icon/search.png";
import {recieveMessages} from "../../services/recieveMessages"
import bellIcon from "../../public/assets/icon/bell.png";
import { userMessages } from "../../chatStore/messages-slice";
// import { recieveMessages } from "../../services"
import { openValue } from "../chatSection";
import style from "./style.module.scss";
import { Users } from "./users";
import classnames from "classnames";

import { fetchMessages } from "../../graphQL/messagesAPI";
import { HeaderLayout } from "../../layouts/header-layout";
import { Card } from "reactstrap";
import { Menu } from "../main/menu";

export const usersData = [
  {
    name: "Someone",
    message: "Hi there",
    iseSeen: false,
    timestamp: "",
    newUser: true,
  },
  {
    name: "Somename",
    message: "Did you review my PR?",
    iseSeen: false,
    timestamp: "",
    newUser: false,
  },
  {
    name: "Billy",
    message: "Is there a public key string or hex representation?",
    iseSeen: true,
    timestamp: "",
    newUser: false,
  },
];

const ChatView = () => {
  const history = useHistory();
  const messages = useSelector(userMessages);
  const [userChats, setUserChats] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [isOpen, setIsOpen] = useState(true && openValue);

  const dispatch=useDispatch();

  useEffect(() => {
    recieveMessages();
    // fetchMessages()
    console.log("useEffet");
    
  }, []);
  
  console.log("messagesmessagesmessages",messages);
  
  useEffect(() => {
    let userLastMessages: any = {};
    console.log("newMessa",messages);
    
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    console.log("userLastMessages",userLastMessages);
    
    setUserChats(userLastMessages);
  }, [messages,dispatch]);
  // const toggle = () => setIsOpen(!isOpen);
  const fillUserChats = () => {
    let userLastMessages: any = {};
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    setUserChats(userLastMessages);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (e.target.value.trim().length) {
      const filteredChats = Object.keys(userChats).filter((contact) =>
        contact.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setUserChats(filteredChats);
    } else {
      fillUserChats();
    }
  };

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
   
    <div className={style.chatContainer}>
      {isOpen && (
        <div className={style.popupContainer}>
          <img src={chatIcon} />
          <br />
          <div className={style.infoContainer}>
            <h3>We've just added Chat!</h3>
            <p>Now you can chat with other active wallets.</p>
            <p>Select who can send you messages</p>
            <form>
              <input type="radio" name="options" id="option1" />
              <label htmlFor="option1">Everybody</label>
              <br />
              <input type="radio" name="options" id="option2" />
              <label htmlFor="option2">Only contacts in address book</label>
              <br />
              <input type="radio" name="options" id="option3" />
              <label htmlFor="option3">Nobody</label>
              <br />
            </form>
            <p>These settings can be changed at any time from the settings menu.</p>
          </div>
          <button type="button" onClick={() => setIsOpen(false)}>
            Continue
          </button>
        </div>
      )}
      <div className={style.searchContainer}>
        <div className={style.searchBox}>
          <img src={searchIcon} alt="search" />
          <input placeholder="Search by name or address" value={inputVal} onChange={handleSearch} />
        </div>
        <img src={newChatIcon} alt="" />
      </div>
      <Users userChats={userChats} />
    </div>
   
    </HeaderLayout>
  );
};

export const ChatPage: FunctionComponent = () => {
  const history = useHistory();

  return <ChatView />;
};
