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
import chevronLeft from "../../public/assets/icon/chevron-left.png";
import { Bech32Address } from "@keplr-wallet/cosmos";
import { observer } from "mobx-react-lite";
import { SwitchUser } from "../../components/switch-user";
import { EthereumEndpoint } from "../../config.ui";
import { NameAddress } from "../chat/users";
import { formatAddress } from "../../utils/format";
import { fetchPublicKey } from "../../utils/fetch-public-key";
import { useSelector } from "react-redux";
import { userDetails } from "../../chatStore/user-slice";
import { Menu } from "../main/menu";

const NewUser = (props: { address: NameAddress }) => {
  const history = useHistory();
  const user = useSelector(userDetails);
  const { chainStore } = useStore();
  const { name, address } = props.address;
  const [isActive, setIsActive] = useState(false);
  const current = chainStore.current;
  useEffect(() => {
    const isUserActive = async () => {
      try {
        const pubKey = await fetchPublicKey(
          user.accessToken,
          current.chainId,
          address
        );
        if (pubKey && pubKey.length > 0) setIsActive(true);
      } catch (e) {
        console.log("NewUser/isUserActive error", e);
      }
    };
    isUserActive();
  }, [address, user.accessToken, current.chainId]);

  const handleClick = () => {
    history.push(`/chat/${address}`);
  };

  return (
    <div
      className={style.messageContainer}
      {...(isActive && { onClick: handleClick })}
    >
      <div className={style.initials}>
        {name.charAt(0).toUpperCase()}
        <div className={style.unread} />
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{name}</div>
        {!isActive && <div className={style.name}>Inactive</div>}
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
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

  const useraddresses: NameAddress[] = addressBookConfig.addressBookDatas.map(
    (data) => {
      return { name: data.name, address: data.address };
    }
  );

  useEffect(() => {
    setAddresses(useraddresses);
  }, [addressBookConfig.addressBookDatas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    const searchedVal = e.target.value.toLowerCase();
    const addresses = useraddresses.filter(
      (address: NameAddress) =>
        address.address !== walletAddress &&
        (address.name.toLowerCase().includes(searchedVal) ||
          address.address.toLowerCase().includes(searchedVal))
    );
    if (
      addresses.length === 0 &&
      searchedVal &&
      searchedVal !== walletAddress
    ) {
      try {
        //check if searchedVal is valid address
        Bech32Address.validate(
          searchedVal,
          chainStore.current.bech32Config.bech32PrefixAccAddr
        );
        const address: NameAddress = {
          name: formatAddress(searchedVal),
          address: searchedVal,
        };
        setAddresses([address]);
      } catch (e) {
        setAddresses([]);
      }
    } else {
      setAddresses(addresses);
    }
  };
  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      menuRenderer={<Menu />}
      rightRenderer={<SwitchUser />}
    >
      <div className={style.newChatContainer}>
        <div className={style.leftBox}>
          <img
            alt=""
            className={style.backBtn}
            src={chevronLeft}
            onClick={() => {
              history.goBack();
            }}
          />
          <span className={style.title}>New Chat</span>
        </div>
      </div>
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
        {addresses.map((address: NameAddress) => {
          return <NewUser address={address} key={address.address} />;
        })}
      </div>
      {addresses.length === 0 && (
        <div className={style.resultText}>No record found</div>
      )}
    </HeaderLayout>
  );
});
