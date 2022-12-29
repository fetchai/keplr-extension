import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { EthereumEndpoint } from "../../../config.ui";
import { HeaderLayout } from "@layouts/index";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ChatMember } from "@components/chat-member";
import { NameAddress } from "@chatTypes";

export const openValue = true;

export const ReviewGroupChat: FunctionComponent = observer(() => {
  const history = useHistory();
  const [addresses, setAddresses] = useState<NameAddress[]>([]);
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountInfo.bech32Address;
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

  useEffect(() => {
    const useraddresses: NameAddress[] = addressBookConfig.addressBookDatas.map(
      (data) => {
        return { name: data.name, address: data.address };
      }
    );
    setAddresses(useraddresses);
  }, [addressBookConfig.addressBookDatas]);

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"super-raven"}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.tokens}>
        <img
          className={style.groupImage}
          src={require("@assets/group710.svg")}
        />
        <span className={style.recommendedSize}>
          Lorem ipsum dolor sit amet consectetur. Eu eu semper vel eu arcu
          felis. Lectus arcu quis.
        </span>
      </div>
      <div className={style.membersContainer}>
        {addresses.map((address: NameAddress) => {
          return <ChatMember address={address} key={address.address} />;
        })}
      </div>
      <button
        className={style.button}
        onClick={() =>
          history.push({
            pathname: "/group-chat/chat-section/" + walletAddress,
          })
        }
      >
        Create Group Chat
      </button>
    </HeaderLayout>
  );
});
