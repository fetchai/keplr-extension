/* eslint-disable react-hooks/exhaustive-deps */
import { RegisterPublicKey } from "@keplr-wallet/background/build/messaging";
import { PrivacySetting } from "@keplr-wallet/background/build/messaging/types";
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
import {
  MessageMap,
  setMessageError,
  userMessages,
} from "../../chatStore/messages-slice";
import {
  setAccessToken,
  setMessagingPubKey,
  userDetails,
} from "../../chatStore/user-slice";
import { SwitchUser } from "../../components/switch-user";
import { EthereumEndpoint } from "../../config.ui";
import { AUTH_SERVER } from "../../config.ui.var";
import { fetchBlockList, messageListener } from "../../graphQL/messages-api";
import { recieveMessages } from "../../graphQL/recieve-messages";
import { HeaderLayout } from "../../layouts";
import newChatIcon from "../../public/assets/icon/new-chat.png";
import privacyIcon from "../../public/assets/hello.png";
import searchIcon from "../../public/assets/icon/search.png";
import { useStore } from "../../stores";
import { getJWT } from "../../utils/auth";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { Menu } from "../main/menu";
import style from "./style.module.scss";
import { NameAddress, Users } from "./users";
import { ChatLoader } from "../../components/chat-loader";
import { ChatErrorPopup } from "../../components/chat-error-popup";
import { observer } from "mobx-react-lite";

const ChatView = observer(() => {
  const userState = useSelector(userDetails);

  const { chainStore, accountStore, queriesStore, chatStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;

  const history = useHistory();
  // const messages = useSelector(userMessages);
  const messages = chatStore.userMessages;
  // address book values
  const queries = queriesStore.get(chainStore.current.chainId);
  chatStore.addMessageList({
    fetch1e8xgz6nmy9rm56ur6p5vv5jfa2es0arv9emh0r: {
      messages: {
        "3a40b528-41e6-49f8-8636-3e281675205c": {
          id: "3a40b528-41e6-49f8-8636-3e281675205c",
          sender: "fetch1e8xgz6nmy9rm56ur6p5vv5jfa2es0arv9emh0r",
          target: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
          contents:
            "eyJkYXRhIjoiZXlKbGJtTnllWEIwWldSVFpXNWtaWEpFWVhSaElqb2lRa2huUTFCT2NVMWtWQzlWYTNCek5UZzJUR3g1YkdGT2NUaFZlR2RuVTJaUksyUTVjR3RZVW01Nk1tZDVUa3RqZERSa2VXcDNlV1JFYUZZMGFrRlBUa05XWW5kaGMxRnhjMWRPWTJSSGRsTkNUamxxT1dzd1UwWkNabE5JYlVsUWFuSm1hMGxMTkhWbFkxcFRNV00xUlhONlNUaDVRa1pvU1hORWVsUnVTelY0UldSSFkyZzRTR1kxV2pjemRrMWxOblF4YWpaeUswWTJkMlF6ZW1sRGJtZzVZazVaY1VOUVJXUlJkR0psYUZKT1IyUkxPR3A0TVVzM2NVaDZiblY2VDAxbFpHTlNWamRaYWxOcGNDdHVNbXRpT1dWWlJERnJPWE5GZGxsQ05HNU5WMnhHY0VRMVJWVjJVRVo1TTNCNVJXeEJUVGRsVUZwMGEzWlpZMWxVZURacVkxSk5TR01yTTBZclFWWkJWMVpKYkVNdlZDdDFaMGhvUVRZd2FWRklSM0JqVWtjMVl6UlVhMXBLUzIxTlltVlNNMjl6TjJWUlQyNWhaR2MxYmxSNE9WbHZTbTV5WTJ4UFNFVnhZMU5ZYkhkUFZHMHdZVWNyUmpSYVZFVkJaMHBFY21aUFJEZGxWbUptTW05NWQydHJSMkZoYVZGck4ybE1URVV5VlZVOUlpd2laVzVqY25sd2RHVmtWR0Z5WjJWMFJHRjBZU0k2SWtKRk5uZEpNMHBEVWtzclVUaGxLMk52VkdaeU5reG1MM0ZYWkVsMWRGQk9iekJ3TmxBNFluRkdNV3RITlZnMVIxQllVbFJPU0hkWE5FMUVORGx3WVdweFFrWm1ObmhZTmtZNWFVWkxSSEZOUlV0VWMxUnJkekl2UVZaemJEVk1jMnhFTDBSVWFWRjVZVlJpYWtoWEsxTnRRMHd4VmpWWk5HTXJjMmgwUnpRcmJpOVlXbVoyV1dnMFdTdHBNR2MwWWtOSlkwbFhNVzFXTjBobGJWaFlWVUZUY2trclIwaEVORWhJTWt4SFdtcFRWbTlOWTJSSVN6QlRVamN6WWsxaFRURkdjeXMxWml0RFpITTBNemx2TTB0Tk1XbFBNMllyWVdVelZUZDVTRUZ4VkVvdmFucHFibEJuVkRSNWJqWnlkSFJ0Ym5aM2VHcEVNRVJFUWk4M1QyNXdVVmhZY2xkc0sxUXpVRTF1VGk5Q1NrbE9kV2N5YjBSQ1dURTBkMHBDWVdoUlMySlBSbk40Y0d4WE1HNU9kalZwT0hKamNDdFZTMmhGU0ZsdVZVNWlialZHUm10M1JVazFSRFV5TjNsdloycDZTbTVTVFhoMFdWZzRUMlZEVm5JdlIzTmtjVGM1T1c1MWFqTnVZbVZET1ZsUlpYUnJWSGd3WkU1V1ZXZEJQU0o5Iiwic2VuZGVyUHVibGljS2V5IjoiMDMyYWYxMmU2YTFhYmI4NDQ1ODE1ZGMxOWUwNjk0M2Y3MjI5OGNlYTMxMzI4MzRiYWIzYmRjYjhlZGM0ODhjMGQ3IiwidGFyZ2V0UHVibGljS2V5IjoiMDM5OWViZWQ4ZmI4MTRmNDMyOGI5NDYwOTIzMWIxMDkwYWZmMzljNzM2NTg2YmMyM2ZlZTYwNmE4ZTI3YTczNGMxIiwic2lnbmF0dXJlIjoiUVM1YWtrdHFKd0JzdmJ2K1k4dldxRTk2aTFlNklXWUZINHh0RFdiRHdyTWc5c0UrS1BCRk9IL3hyckpObnpIMDdnMEJCOG9lckpXS0VPcEo0ZzZRb3c9PSIsImNoYW5uZWxJZCI6Ik1FU1NBR0lORyJ9",
          expiryTimestamp: "1667973567210",
          commitTimestamp: "1666763967210",
        },
      },
      lastMessage: {
        id: "3a40b528-41e6-49f8-8636-3e281675205c",
        sender: "fetch1e8xgz6nmy9rm56ur6p5vv5jfa2es0arv9emh0r",
        target: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
        contents:
          "eyJkYXRhIjoiZXlKbGJtTnllWEIwWldSVFpXNWtaWEpFWVhSaElqb2lRa2huUTFCT2NVMWtWQzlWYTNCek5UZzJUR3g1YkdGT2NUaFZlR2RuVTJaUksyUTVjR3RZVW01Nk1tZDVUa3RqZERSa2VXcDNlV1JFYUZZMGFrRlBUa05XWW5kaGMxRnhjMWRPWTJSSGRsTkNUamxxT1dzd1UwWkNabE5JYlVsUWFuSm1hMGxMTkhWbFkxcFRNV00xUlhONlNUaDVRa1pvU1hORWVsUnVTelY0UldSSFkyZzRTR1kxV2pjemRrMWxOblF4YWpaeUswWTJkMlF6ZW1sRGJtZzVZazVaY1VOUVJXUlJkR0psYUZKT1IyUkxPR3A0TVVzM2NVaDZiblY2VDAxbFpHTlNWamRaYWxOcGNDdHVNbXRpT1dWWlJERnJPWE5GZGxsQ05HNU5WMnhHY0VRMVJWVjJVRVo1TTNCNVJXeEJUVGRsVUZwMGEzWlpZMWxVZURacVkxSk5TR01yTTBZclFWWkJWMVpKYkVNdlZDdDFaMGhvUVRZd2FWRklSM0JqVWtjMVl6UlVhMXBLUzIxTlltVlNNMjl6TjJWUlQyNWhaR2MxYmxSNE9WbHZTbTV5WTJ4UFNFVnhZMU5ZYkhkUFZHMHdZVWNyUmpSYVZFVkJaMHBFY21aUFJEZGxWbUptTW05NWQydHJSMkZoYVZGck4ybE1URVV5VlZVOUlpd2laVzVqY25sd2RHVmtWR0Z5WjJWMFJHRjBZU0k2SWtKRk5uZEpNMHBEVWtzclVUaGxLMk52VkdaeU5reG1MM0ZYWkVsMWRGQk9iekJ3TmxBNFluRkdNV3RITlZnMVIxQllVbFJPU0hkWE5FMUVORGx3WVdweFFrWm1ObmhZTmtZNWFVWkxSSEZOUlV0VWMxUnJkekl2UVZaemJEVk1jMnhFTDBSVWFWRjVZVlJpYWtoWEsxTnRRMHd4VmpWWk5HTXJjMmgwUnpRcmJpOVlXbVoyV1dnMFdTdHBNR2MwWWtOSlkwbFhNVzFXTjBobGJWaFlWVUZUY2trclIwaEVORWhJTWt4SFdtcFRWbTlOWTJSSVN6QlRVamN6WWsxaFRURkdjeXMxWml0RFpITTBNemx2TTB0Tk1XbFBNMllyWVdVelZUZDVTRUZ4VkVvdmFucHFibEJuVkRSNWJqWnlkSFJ0Ym5aM2VHcEVNRVJFUWk4M1QyNXdVVmhZY2xkc0sxUXpVRTF1VGk5Q1NrbE9kV2N5YjBSQ1dURTBkMHBDWVdoUlMySlBSbk40Y0d4WE1HNU9kalZwT0hKamNDdFZTMmhGU0ZsdVZVNWlialZHUm10M1JVazFSRFV5TjNsdloycDZTbTVTVFhoMFdWZzRUMlZEVm5JdlIzTmtjVGM1T1c1MWFqTnVZbVZET1ZsUlpYUnJWSGd3WkU1V1ZXZEJQU0o5Iiwic2VuZGVyUHVibGljS2V5IjoiMDMyYWYxMmU2YTFhYmI4NDQ1ODE1ZGMxOWUwNjk0M2Y3MjI5OGNlYTMxMzI4MzRiYWIzYmRjYjhlZGM0ODhjMGQ3IiwidGFyZ2V0UHVibGljS2V5IjoiMDM5OWViZWQ4ZmI4MTRmNDMyOGI5NDYwOTIzMWIxMDkwYWZmMzljNzM2NTg2YmMyM2ZlZTYwNmE4ZTI3YTczNGMxIiwic2lnbmF0dXJlIjoiUVM1YWtrdHFKd0JzdmJ2K1k4dldxRTk2aTFlNklXWUZINHh0RFdiRHdyTWc5c0UrS1BCRk9IL3hyckpObnpIMDdnMEJCOG9lckpXS0VPcEo0ZzZRb3c9PSIsImNoYW5uZWxJZCI6Ik1FU1NBR0lORyJ9",
        expiryTimestamp: "1667973567210",
        commitTimestamp: "1666763967210",
      },
    },
  });
  console.log("chatStore", chatStore.userMessages);

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
  const [loadingChats, setLoadingChats] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [openDialog, setIsOpendialog] = useState(false);

  const [
    selectedPrivacySetting,
    setSelectedPrivacySetting,
  ] = useState<PrivacySetting>(
    userState?.messagingPubKey.privacySetting
      ? userState?.messagingPubKey.privacySetting
      : PrivacySetting.Everybody
  );

  const requester = new InExtensionMessageRequester();

  const registerAndSetMessagePubKey = async () => {
    setLoadingChats(true);
    try {
      const messagingPubKey = await requester.sendMessage(
        BACKGROUND_PORT,
        new RegisterPublicKey(
          current.chainId,
          userState.accessToken,
          walletAddress,
          selectedPrivacySetting
        )
      );

      store.dispatch(setMessagingPubKey(messagingPubKey));
    } catch (e) {
      // Show error toaster
      console.error("error", e);
      chatStore.setMessageError({
        type: "setup",
        message: "Something went wrong, Please try again in sometime.",
        level: 3,
      });
      // Redirect to home
      history.replace("/");
    } finally {
      setIsOpendialog(false);
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    const getMessagesAndBlocks = async () => {
      setLoadingChats(true);
      try {
        await messageListener(chatStore);
        await recieveMessages(walletAddress, chatStore);
        await fetchBlockList(chatStore);
      } catch (e) {
        console.log("error loading messages", e);
        // store.dispatch(
        chatStore.setMessageError({
          type: "setup",
          message: "Something went wrong, Please try again in sometime.",
          level: 3,
        });
        // );
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
        // store.dispatch(
        chatStore.setMessageError({
          type: "authorization",
          message: "Something went wrong, Message can't be delivered",
          level: 3,
        });
        // );
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

  const addresses: NameAddress = {};

  addressBookConfig.addressBookDatas.map((data) => {
    addresses[data.address] = data.name;
  });

  useEffect(() => {
    setLoadingChats(true);

    const userLastMessages: MessageMap = {};
    Object.keys(messages).map((contact: string) => {
      if (
        userState?.messagingPubKey.privacySetting === PrivacySetting.Contacts &&
        !addresses[contact]
      )
        return;

      userLastMessages[contact] = messages[contact].lastMessage;
    });

    setUserChats(userLastMessages);
    setLoadingChats(false);
  }, [messages]);

  const fillUserChats = () => {
    const userLastMessages: any = {};
    Object.keys(messages).map((contact: string) => {
      if (
        userState?.messagingPubKey.privacySetting === PrivacySetting.Contacts &&
        !addresses[contact]
      )
        return;

      userLastMessages[contact] = messages[contact].lastMessage;
    });
    setUserChats(userLastMessages);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputVal(value);

    if (value.trim()) {
      const userLastMessages: any = {};
      Object.keys(messages).map((contact: string) => {
        userLastMessages[contact] = messages[contact]?.lastMessage;
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

      setUserChats(tempChats);
    } else {
      fillUserChats();
    }
  };

  if (
    userState.messagingPubKey.privacySetting &&
    userState.messagingPubKey.privacySetting === PrivacySetting.Nobody
  ) {
    return (
      <HeaderLayout
        showChainName={true}
        canChangeChainInfo={true}
        menuRenderer={<Menu />}
        rightRenderer={<SwitchUser />}
      >
        <div className={style.lockedInnerContainer}>
          <img
            className={style.imgLock}
            src={require("../../public/assets/img/icons8-lock.svg")}
            alt="lock"
          />

          <div>
            Chat is <b>deactivated</b> based on your current chat privacy
            settings. Please change your chat privacy settings to use this
            feature.
          </div>
          <br />
          <a
            href="#"
            style={{
              textDecoration: "underline",
            }}
            onClick={(e) => {
              e.preventDefault();
              history.push("/setting/chat/privacy");
            }}
          >
            Go to chat privacy settings
          </a>
        </div>
      </HeaderLayout>
    );
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
        {openDialog && userState.accessToken.length > 0 && (
          <>
            <div className={style.overlay} />
            <div className={style.popupContainer}>
              <img src={privacyIcon} />
              <br />
              <div className={style.infoContainer}>
                <h3>We have just added Chat!</h3>
                <p>Now you can chat with other active wallets.</p>
                <p>Select who can send you messages</p>
                <form>
                  <input
                    type="radio"
                    value={PrivacySetting.Everybody}
                    checked={
                      selectedPrivacySetting === PrivacySetting.Everybody
                    }
                    onChange={(e) =>
                      setSelectedPrivacySetting(
                        e.target.value as PrivacySetting
                      )
                    }
                  />
                  <label htmlFor="option1" className={style["options-label"]}>
                    Everybody
                  </label>
                  <br />
                  <input
                    type="radio"
                    value={PrivacySetting.Contacts}
                    checked={selectedPrivacySetting === PrivacySetting.Contacts}
                    onChange={(e) =>
                      setSelectedPrivacySetting(
                        e.target.value as PrivacySetting
                      )
                    }
                  />
                  <label htmlFor="option2" className={style["options-label"]}>
                    Only contacts in address book
                  </label>
                  <br />
                  <input
                    type="radio"
                    value={PrivacySetting.Nobody}
                    checked={selectedPrivacySetting === PrivacySetting.Nobody}
                    onChange={(e) =>
                      setSelectedPrivacySetting(
                        e.target.value as PrivacySetting
                      )
                    }
                  />
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
          </>
        )}

        <div className={style.title}>Chats</div>
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
            <img style={{ cursor: "pointer" }} src={newChatIcon} alt="" />
          </div>
        </div>

        {!addressBookConfig.isLoaded || loadingChats || !userChats ? (
          <ChatLoader message="Loading chats, please wait..." />
        ) : (
          <Users
            chainId={current.chainId}
            userChats={userChats}
            addresses={addresses}
          />
        )}
      </div>
    </HeaderLayout>
  );
});

export const ChatPage: FunctionComponent = () => {
  return <ChatView />;
};
