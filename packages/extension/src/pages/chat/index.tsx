/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { PrivacySetting } from "@keplr-wallet/background/build/messaging/types";
import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  AddressBookConfigMap,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../chatStore";
import {
  Groups,
  setMessageError,
  userChatGroups,
  userChatStorePopulated,
  userChatSubscriptionActive,
} from "../../chatStore/messages-slice";
import {
  setAccessToken,
  setMessagingPubKey,
  userDetails,
} from "../../chatStore/user-slice";
import { ChatErrorPopup } from "../../components/chat-error-popup";
import { ChatLoader } from "../../components/chat-loader";
import { ChatInitPopup } from "../../components/chat/chat-init-popup";
import { ChatSearchInput } from "../../components/chat/chat-search-input";
import { DeactivatedChat } from "../../components/chat/deactivated-chat";
import { SwitchUser } from "../../components/switch-user";
import { EthereumEndpoint } from "../../config.ui";
import { AUTH_SERVER } from "../../config.ui.var";
import { fetchBlockList, messageListener } from "../../graphQL/messages-api";
import { recieveGroups } from "../../graphQL/recieve-messages";
import { HeaderLayout } from "../../layouts";
import { useStore } from "../../stores";
import { getJWT } from "../../utils/auth";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { Menu } from "../main/menu";
import style from "./style.module.scss";
import { NameAddress, Users } from "./users";

const ChatView = () => {
  const userState = useSelector(userDetails);
  const chatStorePopulated = useSelector(userChatStorePopulated);
  const chatSubscriptionActive = useSelector(userChatSubscriptionActive);
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;

  const chatGroups = useSelector(userChatGroups);
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

  const [userGroups, setUserGroups] = useState<Groups | undefined>();
  const [loadingChats, setLoadingChats] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [openDialog, setIsOpendialog] = useState(false);

  const requester = new InExtensionMessageRequester();

  useEffect(() => {
    const getMessagesAndBlocks = async () => {
      setLoadingChats(true);
      try {
        if (!chatSubscriptionActive) messageListener();
        if (!chatStorePopulated) {
          await recieveGroups(0, 10);
          await fetchBlockList();
        }
      } catch (e) {
        console.log("error loading messages", e);
        store.dispatch(
          setMessageError({
            type: "setup",
            message: "Something went wrong, Please try again in sometime.",
            level: 3,
          })
        );
        // Show error visually
      } finally {
        setLoadingChats(false);
      }
    };

    if (
      userState?.accessToken.length &&
      userState?.messagingPubKey.privacySetting &&
      userState?.messagingPubKey.publicKey &&
      walletAddress
    ) {
      getMessagesAndBlocks();
    }
  }, [
    userState.accessToken,
    userState.messagingPubKey.publicKey,
    userState.messagingPubKey.privacySetting,
    walletAddress,
  ]);

  useEffect(() => {
    const setJWTAndFetchMsgPubKey = async () => {
      setLoadingChats(true);
      try {
        const res = await getJWT(current.chainId, AUTH_SERVER);
        store.dispatch(setAccessToken(res));

        const pubKey = await fetchPublicKey(
          res,
          current.chainId,
          walletAddress
        );
        if (!pubKey || !pubKey.publicKey || !pubKey.privacySetting)
          return setIsOpendialog(true);

        store.dispatch(setMessagingPubKey(pubKey));
      } catch (e) {
        store.dispatch(
          setMessageError({
            type: "authorization",
            message: "Something went wrong, Message can't be delivered",
            level: 3,
          })
        );
      }

      setLoadingChats(false);
    };

    if (
      !userState?.messagingPubKey.publicKey &&
      !userState?.messagingPubKey.privacySetting &&
      !userState?.accessToken.length &&
      !loadingChats
    ) {
      setJWTAndFetchMsgPubKey();
    }
  }, [
    current.chainId,
    loadingChats,
    requester,
    walletAddress,
    userState.accessToken.length,
    userState.messagingPubKey.publicKey,
    userState.messagingPubKey.privacySetting,
  ]);

  const [addresses, setAddresses] = useState<NameAddress>({});
  useEffect(() => {
    const configMap = new AddressBookConfigMap(
      new ExtensionKVStore("address-book"),
      chainStore
    );

    const addressBookConfig = configMap.getAddressBookConfig(selectedChainId);
    addressBookConfig.setSelectHandler({
      setRecipient: (): void => {
        // noop
      },
      setMemo: (): void => {
        // noop
      },
    });
    addressBookConfig.waitLoaded().then(() => {
      const addressList: NameAddress = {};
      addressBookConfig.addressBookDatas.map((data) => {
        console.log(data);
        addressList[data.address] = data.name;
      });
      setAddresses(addressList);
    });
  }, [selectedChainId]);

  useEffect(() => {
    setLoadingChats(true);

    const userLastMessageGroups: Groups = {};
    Object.keys(chatGroups).map((contact: string) => {
      if (
        userState?.messagingPubKey.privacySetting === PrivacySetting.Contacts &&
        !addresses[contact]
      )
        return;
      userLastMessageGroups[contact] = chatGroups[contact];
    });

    setUserGroups(userLastMessageGroups);
    setLoadingChats(false);
  }, [chatGroups]);

  const fillUserChats = () => {
    const userLastMessageGroups: Groups = {};
    Object.keys(chatGroups).map((contact: string) => {
      if (
        userState?.messagingPubKey.privacySetting === PrivacySetting.Contacts &&
        !addresses[contact]
      )
        return;
      userLastMessageGroups[contact] = chatGroups[contact];
    });
    setUserGroups(userLastMessageGroups);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputVal(value);

    if (value.trim()) {
      const userLastMessages: any = {};
      Object.keys(chatGroups).map((contact: string) => {
        userLastMessages[contact] = chatGroups[contact];
      });

      const filteredChats = Object.keys(userLastMessages).filter((contact) => {
        const found = Object.keys(addresses).some(
          (address) =>
            (addresses[address].toLowerCase().includes(value.toLowerCase()) ||
              address.toLowerCase().includes(value.toLowerCase())) &&
            address == contact
        );
        return (
          (userState?.messagingPubKey.privacySetting ===
            PrivacySetting.Everybody &&
            contact.toLowerCase().includes(value.toLowerCase())) ||
          found
        );
      });

      const tempChats: any = {};
      filteredChats.forEach((item: any) => {
        tempChats[item] = userLastMessages[item];
      });

      setUserGroups(tempChats);
    } else {
      fillUserChats();
    }
  };

  if (
    userState.messagingPubKey.privacySetting &&
    userState.messagingPubKey.privacySetting === PrivacySetting.Nobody
  ) {
    return <DeactivatedChat />;
  }

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      menuRenderer={<Menu />}
      rightRenderer={<SwitchUser />}
    >
      <ChatErrorPopup />
      <div className={style.chatContainer}>
        <ChatInitPopup
          openDialog={openDialog}
          setIsOpendialog={setIsOpendialog}
          setLoadingChats={setLoadingChats}
        />

        <div className={style.title}>Chats</div>
        <ChatSearchInput handleSearch={handleSearch} searchInput={inputVal} />
        {loadingChats || !userGroups ? (
          <ChatLoader message="Loading chats, please wait..." />
        ) : (
          <Users
            chainId={current.chainId}
            userGroups={userGroups}
            addresses={addresses}
          />
        )}
      </div>
    </HeaderLayout>
  );
};

export const ChatPage: FunctionComponent = () => {
  return <ChatView />;
};
