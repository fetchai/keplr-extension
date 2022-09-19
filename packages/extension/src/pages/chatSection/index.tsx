import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Input, InputGroup } from "reactstrap";
import { userMessages } from "../../chatStore/messages-slice";
import { setPubAddress } from "../../chatStore/user-slice";
import { ChatMessage } from "../../components/chatMessage";
import { delieverMessages } from "../../graphQL/messages-api";
import { HeaderLayout } from "../../layouts/header-layout";
import bellIcon from "../../public/assets/icon/bell.png";
import chevronLeft from "../../public/assets/icon/chevron-left.png";
import moreIcon from "../../public/assets/icon/more-grey.png";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { formatAddress } from "../../utils/format";
import { usersData } from "../chat/index";
import { Menu } from "../main/menu";
import style from "./style.module.scss";

export let openValue = true;
let openPopup = true;

const popupData = {
  report: {
    heading: "Report ",
    text1: "The last 5 messages from this contact will be forwarded to Fetch.",
    text2: "The contact will not be notified.",
    check: "Also block contact and delete chat",
    button: "Report",
  },
  block: {
    heading: "Block ",
    text1: "This contact will not be able to send you messages.",
    text2: "The contact will not be notified.",
    check: "Also report contact",
    text3: "The last 5 messages will be sent to Fetch.",
    button: "Block",
  },
  delete: {
    heading: "Delete ",
    text1: "You will lose all your messages in this chat. This action cannot be undone",
    button: "Delete",
  },
};

export const ChatSection: FunctionComponent = () => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];
  // const userContactName=history.location.pathname.split("/")[3]
  const allMessages = useSelector(userMessages);
  const oldMessages = useMemo(() => allMessages[userName] || {}, [allMessages, userName]);
  const [messages, setMessages] = useState(Object.values(oldMessages.messages));
  const [newMessage, setNewMessage] = useState("");
  const [openBlock, setOpenBlock] = useState(true && openPopup);
  const [showDropdown, setShowDropdown] = useState(false);
  const [added, setAdded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [report, setReport] = useState(false);
  const [name, setName] = useState("");
  const messagesEndRef: any = useRef();

  console.log("userName userName userName",history.location.pathname);
  
  const handleAdd = () => {
    setAdded(true);
    setOpenBlock(false);
  };

  const handleBlock = (username: string) => {
    setBlocked(!blocked);
    setName(username);
    setOpenBlock(false);
  };

  const handleReport = (username: string) => {
    // openPopup = false;
    setReport(true);
    setName(username);
    setOpenBlock(false);
  };

  const handleDropDown = () => {
    setShowDropdown(!showDropdown);
  };

  const getDateValue = (d: any) => {
    const date = new Date(d);
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

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    try {
      const data = await delieverMessages(newMessage, oldMessages.pubKey);
      if (data.dispatchMessages.length > 0) {
        const newMessages = [...messages];
        newMessages.push({ ...data.dispatchMessages[0] });
        setMessages(newMessages);
        setNewMessage("");
        setOpenBlock(false);
        messagesEndRef.current?.scrollIntoView({
          block: "end",
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.log("failed to send : ", error);
    }
  };

  const handleKeydown = (e: { keyCode: number }) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    const setPublicAddress = async () => {
      const pubAddr = await fetchPublicKey(userName);
      setPubAddress({ contact: userName, value: pubAddr });
    };
    if (!oldMessages.pubKey.length) setPublicAddress();
  }, [userName]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
    if (!messages.find((message: any) => message.id === oldMessages.lastMessage.id)) {
      const newMessages = [...messages, oldMessages.lastMessage];
      setMessages(newMessages);
    }
  }, [messages, oldMessages]);

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
          }}>
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
      }>
      <div className={style.username}>
        <div className={style.leftBox}>
          <img
            className={style.backBtn}
            src={chevronLeft}
            onClick={() => {
              history.goBack();
              openValue = false;
            }}
          />
          <span className={style.recieverName}>{formatAddress(userName)}</span>
        </div>
        <img style={{ cursor: "pointer" }} className={style.more} src={moreIcon} onClick={handleDropDown} />
      </div>
      {showDropdown && <Dropdown added={added} blocked={blocked} />}
      <div className={style.messages}>
        {usersData.map((user: any) => {
          if (user.name === userName && user.newUser && openBlock) {
            return (
              <div className={style.newUserText}>
                <p>This contact is not saved in your address book</p>
                <div className={style.buttons}>
                  <button
                    type="button"
                    onClick={() => {
                      user.newUser = false;
                      handleAdd();
                    }}>
                    Add
                  </button>
                  <button type="button" onClick={() => handleBlock(user.name)}>
                    Block
                  </button>
                  <button type="button" onClick={() => handleReport(user.name)}>
                    Report spam
                  </button>
                </div>
              </div>
            );
          }
          return <div key={user.name} />;
        })}

        {report && (
          <Popup
            name={name}
            heading={popupData.report.heading}
            button={popupData.report.button}
            text1={popupData.report.text1}
            text2={popupData.report.text2}
            check={popupData.report.check}
            text3={""}
          />
        )}
        {blocked && (
          <Popup
            name={name}
            heading={popupData.block.heading}
            button={popupData.block.button}
            text1={popupData.block.text1}
            text2={popupData.block.text2}
            check={popupData.block.check}
            text3={popupData.block.text3}
          />
        )}

        <p>Messages are end to end encrypted. Nobody else can read them except you and the recipient.</p>

        {messages
          ?.sort((a: any, b: any) => {
            return a.commitTimestamp - b.commitTimestamp;
          })
          .map((message: any, index) => {
            const check = showDateFunction(message.commitTimestamp);
            return (
              <ChatMessage
                showDate={check}
                message={message.contents}
                isSender={message.sender === userName}
                key={index}
                timestamp={message.commitTimestamp || 1549312452}
              />
            );
          })}
      </div>
      <div ref={messagesEndRef} />
      <InputGroup className={style.inputText}>
        <Input
          className={`${style.inputArea} ${style["send-message-inputArea"]}`}
          placeholder="Type a new message..."
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleKeydown}
        />
        {newMessage.length ? (
          <div className={style["send-message-icon"]} onClick={handleSendMessage}>
            <img src={paperAirplaneIcon} />
          </div>
        ) : (
          ""
        )}
      </InputGroup>
    </HeaderLayout>
  );
};

const Dropdown = ({ added, blocked }: { added: boolean; blocked: boolean }) => {
  return (
    <div className={style.dropdown}>
      {added ? <div>View in address book</div> : <div>Add to address book</div>}
      {blocked ? <div>Unblock contact</div> : <div>Block contact</div>}
      <div>Report as spam</div>
      <div>Delete chat</div>
    </div>
  );
};

const Popup = ({
  name,
  heading,
  button,
  text1,
  text2,
  text3,
  check,
}: {
  name: string;
  heading: string;
  button: string;
  text1: string;
  text2: string;
  text3: string;
  check: string;
}) => {
  // const [popup, setPopup] = useState(true);

  const handleClick = () => {
    openPopup = false;
  };

  return (
    <>
      <div className={style.popup}>
        <h4>
          {heading}
          <span>{name} ?</span>
        </h4>
        <section>
          <p className={style.textContainer}>{text1}</p>
          <p className={style.textContainer}>{text2}</p>
          <div className={style.textContainer}>
            <input type="checkbox" id="check" />
            <label htmlFor="check">{check}</label>
          </div>
          <p className={style.textContainer}>{text3}</p>
        </section>
        <div className={style.buttonContainer}>
          <button type="button">Cancel</button>
          <button type="button" className={style.btn} onClick={handleClick}>
            {button}
          </button>
        </div>
      </div>
      {/* } */}
    </>
  );
};
