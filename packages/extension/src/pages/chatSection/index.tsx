import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Input, InputGroup } from "reactstrap";
import { userMessages } from "../../chatStore/messages-slice";
import { ChatMessage } from "../../components/chatMessage";
import { EthereumEndpoint } from "../../config.ui";
import { delieverMessages } from "../../graphQL/messages-api";
import { HeaderLayout } from "../../layouts/header-layout";
import bellIcon from "../../public/assets/icon/bell.png";
import chevronLeft from "../../public/assets/icon/chevron-left.png";
import moreIcon from "../../public/assets/icon/more-grey.png";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { useStore } from "../../stores";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { formatAddress } from "../../utils/format";
import { Menu } from "../main/menu";
import { ToolTip } from "../../components/tooltip";
import style from "./style.module.scss";

export let openValue = true;

export const ChatSection: FunctionComponent = () => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];
  const allMessages = useSelector(userMessages);
  const oldMessages = useMemo(() => allMessages[userName] || {}, [
    allMessages,
    userName,
  ]);
  const [messages, setMessages] = useState(
    Object.values(oldMessages?.messages || [])
  );
  const [newMessage, setNewMessage] = useState("");
  const [targetPubKey, setTargetPubKey] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  
  
  // const [openPopup, setOpenPopup] = useState(false)

  const messagesEndRef: any = useRef();

  // address book values
  const queries = queriesStore.get(chainStore.current.chainId);
  const ibcTransferConfigs = useIBCTransferConfig(
    chainStore,
    chainStore.current.chainId,
    accountInfo.msgOpts.ibcTransfer,
    accountInfo.bech32Address,
    queries.queryBalances,
    EthereumEndpoint
  );

  const [selectedChainId, setSelectedChainId] = useState(
    ibcTransferConfigs.channelConfig?.channel
      ? ibcTransferConfigs.channelConfig.channel.counterpartyChainId
      : current.chainId
  );

  const addressBookConfig = useAddressBookConfig(
    new ExtensionKVStore("address-book"),
    chainStore,
    selectedChainId,
    {
      setRecipient: (): void => {
        // noop
      },
      setMemo: (): void => {
        // noop
      },
    }
  );
  const addresses = addressBookConfig.addressBookDatas.map((data, i) => {
    return { name: data.name, address: data.address };
  });

  const contactName = (addresses: any) => {
    let val = "";
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].address == userName) {
        val = addresses[i].name;
      }
    }
    return val;
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
    console.log("accountInfoaccountInfoaccountInfo",accountInfo.bech32Address);
    try {
      console.log(oldMessages);
      const data = await delieverMessages(
        newMessage,
        targetPubKey,
        accountInfo.bech32Address
      );
      if (data?.dispatchMessages?.length > 0) {
        const newMessages = [...messages];
        newMessages.push({ ...data.dispatchMessages[0] });
        setMessages(newMessages);
        setNewMessage("");
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
      console.log("setPublicAddress");
      const pubAddr = await fetchPublicKey(userName);
      
      
      setTargetPubKey(pubAddr || "");
    };
    if (!oldMessages?.pubKey?.length) setPublicAddress();
  }, [userName]);

  useEffect(() => {
    if (!messages?.find((message: any) => message?.id === oldMessages?.lastMessage?.id)) {
      const newMessages = [...messages, oldMessages?.lastMessage];
      setMessages(newMessages);
    }
    // 👇️ scroll to bottom every time messages change
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [oldMessages,messages]);

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
        <div className={style.leftBox}>
          <img
            className={style.backBtn}
            src={chevronLeft}
            onClick={() => {
              history.goBack();
              openValue = false;
            }}
          />
          <span className={style.recieverName}>
            {contactName(addresses).length
              ? contactName(addresses)
              : formatAddress(userName)}
          </span>
        </div>
        <img
          style={{ cursor: "pointer" }}
          className={style.more}
          src={moreIcon}
          onClick={handleDropDown}
        />
      </div>
      <div className={style.messages}>
        <p>
          Messages are end to end encrypted. Nobody else can read them except
          you and the recipient.
        </p>
        {messages
          ?.sort((a: any, b: any) => {
            return a.commitTimestamp - b.commitTimestamp;
          })
          ?.map((message: any, index) => {
            const check = showDateFunction(message?.commitTimestamp);
            return (
              <ChatMessage
                showDate={check}
                message={message?.contents}
                isSender={message?.sender === userName}
                key={index}
                timestamp={message?.commitTimestamp || 1549312452}
              />
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <InputGroup className={style.inputText}>
       { targetPubKey.length?<Input
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder="Type a new message..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeydown}
            disabled={false}
          />:<ToolTip
          trigger="hover"
          options={{ placement: "top" }}
          tooltip={<div>No transaction history found for this user</div>}
        >
          <Input
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder="Type a new message..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeydown}
            disabled={ true}
          />
        </ToolTip>}
        {newMessage?.length ? (
          <div
            className={style["send-message-icon"]}
            onClick={handleSendMessage}
          >
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

const Popup = ({ popupData }: { popupData: any }) => {
  const { name, heading, button, text1, text2, text3, check } = popupData;
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
