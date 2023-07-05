/* eslint-disable react-hooks/exhaustive-deps */
import { userDetails } from "@chatStore/user-slice";
import { ChatErrorPopup } from "@components/chat-error-popup";
import { ChatLoader } from "@components/chat-loader";
import { SwitchUser } from "@components/switch-user";
import {
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { HeaderLayout } from "@layouts/index";
import { fetchPublicKey } from "@utils/fetch-public-key";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useStore } from "../../stores";
import { Menu } from "../main/menu";
import { ChatsViewSection } from "./chats-view-section";
import { UserNameSection } from "./username-section";
import { InitialGas } from "../../config.ui";

export const AgentChatSection: FunctionComponent = () => {
  const targetAddress = useLocation().pathname.split("/")[3];
  const user = useSelector(userDetails);

  const [targetPubKey, setTargetPubKey] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const { chainStore, accountStore, queriesStore, uiConfigStore } = useStore();

  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  useEffect(() => {
    const setPublicAddress = async () => {
      const pubAddr = await fetchPublicKey(
        user.accessToken,
        current.chainId,
        targetAddress
      );
      setTargetPubKey(pubAddr?.publicKey || "");
    };
    setPublicAddress();
  }, [user.accessToken, current.chainId, targetAddress]);

  const ibcTransferConfigs = useIBCTransferConfig(
    chainStore,
    queriesStore,
    chainStore.current.chainId,
    accountInfo.bech32Address,
    InitialGas,
    {
      allowHexAddressOnEthermint: true,
      icns: uiConfigStore.icnsInfo,
    }
  );
  const [selectedChainId] = useState(
    ibcTransferConfigs.channelConfig?.channel
      ? ibcTransferConfigs.channelConfig.channel.counterpartyChainId
      : current.chainId
  );

  const addresses = uiConfigStore.addressBookConfig.getAddressBook(selectedChainId);

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      menuRenderer={<Menu />}
      rightRenderer={<SwitchUser />}
    >
      <UserNameSection addresses={addresses} />
      <ChatErrorPopup />
      {loadingChats ? (
        <ChatLoader message="Arranging messages, please wait..." />
      ) : (
        <ChatsViewSection
          targetPubKey={targetPubKey}
          setLoadingChats={setLoadingChats}
        />
      )}
    </HeaderLayout>
  );
};
