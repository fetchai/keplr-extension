import React, { FunctionComponent, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { ChatMessage } from "../../components/chatMessage";
import { HeaderLayout } from "../../layouts";
import bellIcon from "../../public/assets/icon/bell.png";
import chevronLeft from "../../public/assets/icon/chevron-left.png";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { Menu } from "../main/menu";
import style from "./style.module.scss";

const messagesData = [
  {
    message: "here's the placeholder message that somebody wrote okay ",
    isSender: false,
    timestamp: 1659017100,
  },
  {
    message: "I’ve never watched that show in my life I can tell you that",
    isSender: true,
    timestamp: 1659017100,
  },
  {
    message: "Listen man Idc about Love Island, it’s not my kinda show",
    isSender: false,
    timestamp: 1659017100,
  },
  {
    message: "here's the placeholder message that somebody wrote okay ",
    isSender: false,
    timestamp: 1659018100,
  },
  {
    message: "here's the placeholder message that somebody wrote okay ",
    isSender: true,
    timestamp: 1659023100,
  },
  {
    message: "here's the placeholder message that somebody wrote okay ",
    isSender: false,
    timestamp: 1659025100,
  },
  {
    message: "I’ve never watched that show in my life I can tell you that",
    isSender: true,
    timestamp: 1659029100,
  },
];

export const ChatSection: FunctionComponent = () => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef: any = useRef();

  const handleNewMessage = () => {
    const newMessages = [...messages];
    const timestamp = new Date().getTime();
    newMessages.push({ message: newMessage, isSender: true, timestamp });
    setMessages(newMessages);
    setNewMessage("");
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeypress = (e: { keyCode: number }) => {
    console.log(e);
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleNewMessage();
    }
  };  const getDateValue = (d: any) => {
    let date = new Date(d);
    return date.getDate();
  };
  let prevDate = 0;
  const showDateFunction = (d: any) => {
    const date = getDateValue(d);

    if (prevDate !== date) {
      prevDate = date;
      return true;
    }
    return false;
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
      <div className={style.username}>
        <img
          className={style.backBtn}
          src={chevronLeft}
          onClick={() => {
            history.goBack();
          }}
        />
        <span className={style.recieverName}>{userName}</span>
      </div>
      <div className={style.messages}>
      <p>Messages are end to end encrypted. Nobody else can read them except you and the recipient.</p>
        {messages.map(({ message, isSender, timestamp }, index) => {
          const check = showDateFunction(timestamp);
          return (
          <ChatMessage
            message={message}
            isSender={isSender}
            key={index}
            timestamp={timestamp || 1549312452}
            showDate={check}

          />
        )})}
        <div ref={messagesEndRef} />
      </div>
      <InputGroup className={style.inputText}>
        <Input
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyPress={handleKeypress}
          placeholder="Type a new message..."
        />
        <InputGroupAddon addonType="append">
          <Button
            outline
            onClick={handleNewMessage}
            className={style.enterMessageIcon}
          >
            <img src={paperAirplaneIcon} />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </HeaderLayout>
  );
};
