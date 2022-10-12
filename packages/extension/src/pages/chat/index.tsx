import { RegisterPublicKey } from "@keplr-wallet/background/build/messaging";
import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { store } from "../../chatStore";
import { MessageMap, userMessages } from "../../chatStore/messages-slice";
import {
  setAccessToken,
  setMessagingPubKey,
  userDetails,
} from "../../chatStore/user-slice";
import { SwitchUser } from "../../components/switch-user";
import { EthereumEndpoint } from "../../config.ui";
import { AUTH_SERVER } from "../../config/config";
import { fetchBlockList, messageListener } from "../../graphQL/messages-api";
import { recieveMessages } from "../../graphQL/recieve-messages";
import { HeaderLayout } from "../../layouts";
import newChatIcon from "../../public/assets/icon/new-chat.png";
import searchIcon from "../../public/assets/icon/search.png";
import { useStore } from "../../stores";
import { getJWT } from "../../utils/auth";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { Menu } from "../main/menu";
import style from "./style.module.scss";
import { Users } from "./users";

// import {getPubKey, registerPubKey} from "@keplr-wallet/background/build/messaging/memorandum-client";

const ChatView = () => {
  const userState = useSelector(userDetails);

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

  const [userChats, setUserChats] = useState<MessageMap | undefined>();
  const [inputVal, setInputVal] = useState("");
  const [openDialog, setIsOpendialog] = useState(false);
  const [initialChats, setInitialChats] = useState<MessageMap>({});

  const requester = new InExtensionMessageRequester();

  const registerAndSetMessagePubKey = async () => {
    try {
      const messagingPubKey = await requester.sendMessage(
        BACKGROUND_PORT,
        new RegisterPublicKey(
          current.chainId,
          userState.accessToken,
          walletAddress
        )
      );

      store.dispatch(setMessagingPubKey(messagingPubKey));
      setIsOpendialog(false);
    } catch (e) {
      // Show error toaster
      console.error("error", e);
      setIsOpendialog(false);
      // Redirect to home
      history.replace("/");
    }
  };

  useEffect(() => {
    const setJWTAndFetchMsgPubKey = async () => {
      const res = await getJWT(current.chainId, AUTH_SERVER);
      store.dispatch(setAccessToken(res));

      const pubKey = await fetchPublicKey(res, current.chainId, walletAddress);
      if (!pubKey) return setIsOpendialog(true);

      store.dispatch(setMessagingPubKey(pubKey));
      messageListener();
      recieveMessages(walletAddress);
      fetchBlockList();
    };
    if (!userState?.accessToken.length || !userState?.messagingPubKey.length)
      setJWTAndFetchMsgPubKey();
  }, [
    current.chainId,
    requester,
    userState.accessToken.length,
    userState.messagingPubKey.length,
    walletAddress,
  ]);

  useEffect(() => {
    const userLastMessages: MessageMap = {};
    Object.keys(messages).map((contact: string) => {
      userLastMessages[contact] = messages[contact].lastMessage;
    });
    if (Object.keys(initialChats).length === 0) {
      setUserChats(userLastMessages);
      setInitialChats(userLastMessages);
    }
  }, [messages]);
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
      rightRenderer={<SwitchUser />}
    >
      <div className={style.chatContainer}>
        {openDialog && userState.accessToken.length > 0 && (
          <div className={style.popupContainer}>
            {/* <img src={chatIcon} /> */}
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
            <button type="button" onClick={registerAndSetMessagePubKey}>
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
  return <ChatView />;
};
