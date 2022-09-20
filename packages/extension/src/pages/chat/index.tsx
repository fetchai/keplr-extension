import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { store } from "../../chatStore";
import { userMessages } from "../../chatStore/messages-slice";
import { userDetails } from "../../chatStore/user-slice";
import chatIcon from "../../public/assets/hello.png";
import bellIcon from "../../public/assets/icon/bell.png";
import newChatIcon from "../../public/assets/icon/new-chat.png";
import searchIcon from "../../public/assets/icon/search.png";
import { recieveMessages } from "../../services/recieve-messages";
// import { recieveMessages } from "../../services"
import { openValue } from "../chatSection";
import style from "./style.module.scss";
import { Users } from "./users";
import { setAccessToken } from "../../chatStore/user-slice";
import { HeaderLayout } from "../../layouts/header-layout";
import { Menu } from "../main/menu";
import { getJWT } from "../../utils/auth";
import { useStore } from "../../stores";
import { toHex } from "@cosmjs/encoding";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { EthereumEndpoint } from "../../config.ui";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";

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
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;
  const pubKey = accountInfo.pubKey;

  const history = useHistory();
  const messages = useSelector(userMessages);
  const user = useSelector(userDetails);

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

  const [userChats, setUserChats] = useState<any>({});
  const [inputVal, setInputVal] = useState("");
  const [isOpen, setIsOpen] = useState(true && openValue);

  const dispatch = useDispatch();

  useEffect(() => {
    recieveMessages();
  }, []);
  console.log("messages messages", messages);

  useEffect(() => {
    console.log(`Hey ${user.accessToken}`);

    const userLastMessages: any = {};
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    setUserChats(userLastMessages);
  }, [messages, dispatch]);
  // const toggle = () => setIsOpen(!isOpen);
  const fillUserChats = () => {
    const userLastMessages: any = {};
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    setUserChats(userLastMessages);
  };

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

  // console.log("addressBookConfig", addressBookConfig);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);

    if (e.target.value.trim()) {
      const filteredChats = Object.keys(userChats).filter((contact) => {
        return contact.toLowerCase().includes(inputVal.toLowerCase());
      });
      console.log(filteredChats);

      let tempChats: any = {};
      filteredChats.forEach((item: any) => {
        tempChats[item] = userChats[item];
      });

      setUserChats(tempChats);
    } else {
      fillUserChats();
    }
  };
  console.log("addressBookConfig from chat",addressBookConfig);
  
  const addresses = addressBookConfig.addressBookDatas.map((data, i) => {
    return { name: data.name, address: data.address };
  });

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
        {!user.accessToken && (
          <div className={style.popupContainer}>
            <img src={chatIcon} />
            <br />
            <div className={style.infoContainer}>
              <h3>We have just added Chat!</h3>
              <p>Now you can chat with other active wallets.</p>
              <p>Select who can send you messages</p>
              <form>
                <input type="radio" name="options" id="option1" />
                <label htmlFor="option1" className={style["options-label"]}>
                  Everybody
                </label>
                <br />
                <input type="radio" name="options" id="option2" />
                <label htmlFor="option2" className={style["options-label"]}>
                  Only contacts in address book
                </label>
                <br />
                <input type="radio" name="options" id="option3" />
                <label htmlFor="option3" className={style["options-label"]}>
                  Nobody
                </label>
                <br />
              </form>
              <p>
                These settings can be changed at any time from the settings
                menu.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await getJWT(
                    current.chainId,
                    {
                      address: walletAddress,
                      pubkey: toHex(pubKey),
                    },
                    "https://auth-attila.sandbox-london-b.fetch-ai.com"
                  );

                  // dispatch(tokenStatus(true))
                  store.dispatch(setAccessToken(res));
                  setIsOpen(false);
                  history.replace("/chat");
                } catch (e: any) {
                  console.log(e.message);
                }
              }}
            >
              Continue
            </button>
          </div>
        )}
        <div className={style.searchContainer}>
          <div className={style.searchBox}>
            <img src={searchIcon} alt="search" />
            <input
              placeholder="Search by name or address"
              value={inputVal}
              onChange={handleSearch}
            />
          </div>
          <div onClick={() => history.push("/chat/newchat")}>
            <img src={newChatIcon} alt="" />
          </div>
        </div>
        <Users userChats={userChats} addresses={addresses} />
      </div>
    </HeaderLayout>
  );
};

export const ChatPage: FunctionComponent = () => {
  // const history = useHistory();

  return <ChatView />;
};
