import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { ChatMessage } from "../../components/chatMessage";
import { HeaderLayout } from "../../layouts";
import bellIcon from "../../public/assets/icon/bell.png";
import chevronLeft from "../../public/assets/icon/chevron-left.png";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { Menu } from "../main/menu";
import style from "./style.module.scss";

export const ChatSection: FunctionComponent = () => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];
  const [messages, setMessages] = useState([
    { message: "testing message", isSender: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessage = () => {
    const newMessages = [...messages];
    newMessages.push({ message: newMessage, isSender: true });
    setMessages(newMessages);
    setNewMessage("");
  };
  const handleKeypress = (e: { keyCode: number }) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleNewMessage();
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
        {messages.map(({ message, isSender }, index) => (
          <ChatMessage message={message} isSender={isSender} key={index} />
        ))}
      </div>
      <InputGroup className={style.inputText}>
        <Input
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyPress={handleKeypress}
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
