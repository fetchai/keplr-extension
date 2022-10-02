import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { store } from "../../chatStore";
import { MessageMap, userMessages } from "../../chatStore/messages-slice";
import { setAccessToken, setMessagingPubKey } from "../../chatStore/user-slice";
import { EthereumEndpoint } from "../../config.ui";
import { HeaderLayout } from "../../layouts";
import bellIcon from "../../public/assets/icon/bell.png";
import newChatIcon from "../../public/assets/icon/new-chat.png";
import searchIcon from "../../public/assets/icon/search.png";
import { useStore } from "../../stores";
import { getJWT } from "../../utils/auth";
import { Menu } from "../main/menu";
import style from "./style.module.scss";
import { Users } from "./users";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { RegisterPublicKey } from "@keplr-wallet/background/build/messaging";
import { AUTH_SERVER } from "../../config/config";

const ChatView = () => {
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;

  const history = useHistory();
  const messages = useSelector(userMessages);
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

  const [selectedChainId] = useState(
    ibcTransferConfigs.channelConfig?.channel
      ? ibcTransferConfigs.channelConfig.channel.counterpartyChainId
      : current.chainId
  );

  const [userChats, setUserChats] = useState<MessageMap>({});
  const [inputVal, setInputVal] = useState("");
  const [, setInitialChats] = useState<MessageMap>({});
  const dispatch = useDispatch();

  const requester = new InExtensionMessageRequester();

  useEffect(() => {
    const setJWTAndRegisterMsgPubKey = async () => {
      const res = await getJWT(current.chainId, AUTH_SERVER);

      store.dispatch(setAccessToken(res));

      const messagingPubKey = await requester.sendMessage(
        BACKGROUND_PORT,
        new RegisterPublicKey(current.chainId, res, walletAddress)
      );

      store.dispatch(setMessagingPubKey(messagingPubKey));
    };

    setJWTAndRegisterMsgPubKey();
  }, [current.chainId, requester, walletAddress]);

  useEffect(() => {
    const userLastMessages: MessageMap = {};
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    setUserChats(userLastMessages);
    setInitialChats(userLastMessages);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputVal(value);

    if (value.trim()) {
      const userLastMessages: any = {};
      Object.keys(messages).map((contact: string) => {
        userLastMessages[contact] = messages[contact]?.lastMessage;
      });
      const filteredChats = Object.keys(userLastMessages).filter((contact) => {
        const found = addresses.some(
          (address: any) =>
            address.name.toLowerCase().includes(value.toLowerCase()) &&
            address.address == contact
        );
        return contact.toLowerCase().includes(value.toLowerCase()) || found;
      });

      const tempChats: any = {};
      filteredChats.forEach((item: any) => {
        tempChats[item] = userLastMessages[item];
      });

      setUserChats(tempChats);
    } else {
      // setUserChats(userChats)
      fillUserChats();
    }
  };

  const addresses = addressBookConfig.addressBookDatas.map((data) => {
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
        {/* {!user.accessToken && (
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
              <p>These settings can be changed at any time from the settings menu.</p>
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
              }}>
              Continue
            </button>
          </div>
        )} */}

        <div className={style.searchContainer}>
          <div className={style.searchBox}>
            <img src={searchIcon} alt="search" />
            <input
              placeholder="Search by name or address"
              value={inputVal}
              onChange={handleSearch}
            />
          </div>
          <div onClick={() => history.push("/newChat")}>
            <img src={newChatIcon} alt="" />
          </div>
        </div>
        <Users
          chainId={current.chainId}
          userChats={userChats}
          addresses={addresses}
        />
      </div>
    </HeaderLayout>
  );
};

export const ChatPage: FunctionComponent = () => {
  // const history = useHistory();

  return <ChatView />;
};
