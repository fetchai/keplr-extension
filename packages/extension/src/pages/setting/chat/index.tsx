import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "../../../layouts";
import { useIntl } from "react-intl";
// import { useLanguage } from "../../../languages";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import { PageButton } from "../page-button";
import { getJWT } from "../../../utils/auth";
import {
  setAccessToken,
  setMessagingPubKey,
  userDetails,
} from "../../../chatStore/user-slice";
import { fetchPublicKey } from "../../../utils/fetch-public-key";
import { store } from "../../../chatStore";
import { AUTH_SERVER } from "../../../config/config";
import { useSelector } from "react-redux";
import { useStore } from "../../../stores";
import { userMessages } from "../../../chatStore/messages-slice";
import { fetchBlockList } from "../../../graphQL/messages-api";
import { PrivacySetting } from "@keplr-wallet/background/build/messaging/types";

export const ChatSettings: FunctionComponent = observer(() => {
  // const language = useLanguage();
  const history = useHistory();
  const intl = useIntl();
  const userState = useSelector(userDetails);
  const messages = useSelector(userMessages);
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;
  const [loadingChatSettings, setLoadingChatSettings] = useState(false);
  const [chatPubKeyExists, setChatPubKeyExists] = useState(true);
  useEffect(() => {
    const setJWTAndFetchMsgPubKey = async () => {
      setLoadingChatSettings(true);
      const res = await getJWT(current.chainId, AUTH_SERVER);
      store.dispatch(setAccessToken(res));

      const pubKey = await fetchPublicKey(res, current.chainId, walletAddress);
      store.dispatch(setMessagingPubKey(pubKey));

      if (!pubKey?.publicKey || pubKey.privacySetting === PrivacySetting.Nobody) {
        setChatPubKeyExists(false);
        return setLoadingChatSettings(false);
      }
      fetchBlockList();
      setLoadingChatSettings(false);
    };
    if (
      (!userState.accessToken.length || !userState.messagingPubKey.length) &&
      !loadingChatSettings
    )
      setJWTAndFetchMsgPubKey();
  }, [
    current.chainId,
    loadingChatSettings,
    userState.accessToken.length,
    userState.messagingPubKey.length,
    walletAddress,
  ]);
  
  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "setting.chat",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.container}>
        <PageButton
          title={intl.formatMessage({
            id: "setting.block",
          })}
          paragraph={
            chatPubKeyExists
              ? `${
                  Object.values(messages).filter((user: any) => user.isBlocked)
                    .length
                } Addresses Blocked`
              : "Please Activate Chat Functionality to Proceed"
          }
          onClick={() => {
            if (chatPubKeyExists)
              history.push({
                pathname: "/setting/chat/block",
              });
          }}
          icons={useMemo(
            () => !loadingChatSettings && chatPubKeyExists ? [ <i key="next" className="fas fa-chevron-right" />] : [],
            [chatPubKeyExists, loadingChatSettings]
          )}
        />
        <PageButton
          title={intl.formatMessage({
            id: "setting.privacy",
          })}
          paragraph={intl.formatMessage({
            id: "setting.privacy.paragraph",
          })}
          onClick={() => {
            history.push({
              pathname: "/setting/block",
            });
          }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
        />
        {/* <PageButton
          title={intl.formatMessage({
            id: "setting.receipts",
          })}
          paragraph={intl.formatMessage({
            id: "setting.receipts.paragraph",
          })}
          // onClick={() => {
          //   history.push({
          //     pathname: "/setting/block",
          //   });
          // }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
        /> */}
      </div>
    </HeaderLayout>
  );
});
