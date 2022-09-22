import { ObservableEnsFetcher } from "@keplr-wallet/ens";
import { useIBCTransferConfig, useRecipientConfig } from "@keplr-wallet/hooks";
import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "../../layouts/header-layout";
import bellIcon from "../../public/assets/icon/bell.png";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import searchIcon from "../../public/assets/icon/search.png";
import { useStore } from "../../stores";
import style from "./style.module.scss";

import { EthereumEndpoint } from "../../config.ui";


const ADDRESSES = [
  {
    name: "fetchWallet2",
    address: "fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc",
  },
  {
    name: "user2",
    address: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
  },
];

const NewUser = (props: any) => {
  const history = useHistory();
  const { name, address } = props.address;
  const inputVal = props.inputVal;

  const handleClick = () => {
    console.log("address from new chatt", address);

    history.push(`/chat/${address}`);
  };
  return (
    <>
      <div className={style.messageContainer} onClick={handleClick}>
        <div className={style.initials}>
          {name.charAt(0).toUpperCase()}
          {!false && <div className={style.unread} />}
        </div>
        <div className={style.messageInner}>
          <div className={style.name}>{name}</div>
        </div>
        <div>
          <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
        </div>
      </div>
    </>
  );
};
export const NewChat: FunctionComponent = () => {
  const history = useHistory();
  const [inputVal, setInputVal] = useState("");
  const [addresses, setAddresses] = useState(ADDRESSES);
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

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
  const recipientConfig = useRecipientConfig(chainStore, selectedChainId, EthereumEndpoint);
  const isENSAddress = ObservableEnsFetcher.isValidENS("absa");
  const error = recipientConfig.getError();
  console.log("isENSAddress", isENSAddress, "error ", error);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setAddresses(addresses.filter((address: any) => address.name.includes(inputVal)));
    console.log("recipientConfig", recipientConfig);
  };
  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      onBackButton={() => {
        history.goBack();
      }}
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
      <div className={style.searchContainer}>
        <div className={style.searchBox}>
          <img src={searchIcon} alt="search" />
          <input placeholder="Search by name or address" value={inputVal} onChange={handleSearch} />
        </div>
      </div>
      <div className={style.messagesContainer}>
        {addresses.map((address: any) => {
          console.log("address address in new component", address);
          return <NewUser address={address} inputVal={inputVal} />;
        })}
      </div>
    </HeaderLayout>
  );
};
