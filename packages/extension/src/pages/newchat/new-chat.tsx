import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "../../layouts";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import searchIcon from "../../public/assets/icon/search.png";
import { useStore } from "../../stores";
import style from "./style.module.scss";

import { observer } from "mobx-react-lite";
import { SwitchUser } from "../../components/switch-user";
import { EthereumEndpoint } from "../../config.ui";
import { NameAddress } from "../chat/users";

// TODO(!!!): Remove debug comments
// const ADDRESSES = [
//   {
//     name: "fetchWallet2",
//     address: "fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc",
//   },
//   {
//     name: "user2",
//     address: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
//   },
// ];

const NewUser = (props: any) => {
  const history = useHistory();
  const { name, address } = props.address;

  const handleClick = () => {
    history.push(`/chat/${address}`);
  };

  return (
    <div key={props.key}>
      <div className={style.messageContainer} onClick={handleClick}>
        <div className={style.initials}>
          {name.charAt(0).toUpperCase()}
          <div className={style.unread} />
        </div>
        <div className={style.messageInner}>
          <div className={style.name}>{name}</div>
        </div>
        <div>
          <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
        </div>
      </div>
    </div>
  );
};
export const NewChat: FunctionComponent = observer(() => {
  const history = useHistory();
  const [inputVal, setInputVal] = useState("");
  const [addresses, setAddresses] = useState<NameAddress[]>([]);
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

  const useraddresses: any = addressBookConfig.addressBookDatas.map((data) => {
    return { name: data.name, address: data.address };
  });

  useEffect(() => {
    const userAddresses: NameAddress[] = addressBookConfig.addressBookDatas.map(
      (data) => {
        return { name: data.name, address: data.address };
      }
    );
    setAddresses(userAddresses);
  }, [addressBookConfig.addressBookDatas]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    const val = e.target.value;
    setAddresses(
      useraddresses.filter((address: any) =>
        address.name.toLowerCase().includes(val)
      )
    );
  };
  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      onBackButton={() => {
        history.goBack();
      }}
      rightRenderer={<SwitchUser />}
    >
      <div className={style.searchContainer}>
        <div className={style.searchBox}>
          <img src={searchIcon} alt="search" />
          <input
            placeholder="Search by name or address"
            value={inputVal}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className={style.messagesContainer}>
        {addresses.map((address: any) => {
          return (
            <NewUser
              address={address}
              key={address.address}
              inputVal={inputVal}
            />
          );
        })}
      </div>
      {addresses.length == 0 ? (
        <button
          onClick={() => {
            history.push({
              pathname: "/setting/address-book",
              state: {
                currentState: true,
                currentValue: inputVal,
              },
            });
          }}
        >
          Add new contact to address book
        </button>
      ) : (
        ""
      )}
    </HeaderLayout>
  );
});
