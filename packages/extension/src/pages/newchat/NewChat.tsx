import React, { FunctionComponent, useState } from "react";
import { HeaderLayout } from "../../layouts/header-layout";
import { Menu } from "../main/menu";
import bellIcon from "../../public/assets/icon/bell.png";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import searchIcon from "../../public/assets/icon/search.png";
import rightArrowIcon from "../../public/assets/icon/right-arrow.png";
import { useStore } from "../../stores";
import {
  useAddressBookConfig,
  useRecipientConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { ObservableEnsFetcher } from "@keplr-wallet/ens";

import { EthereumEndpoint } from "../../config.ui";

const usersData = {
  fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc: {
    commitTimestamp: 1663657726784,
    contents:
      "eyJkYXRhIjoiN2IyMjYxNjM2MzZmNzU2ZTc0NWY2ZTc1NmQ2MjY1NzIyMjNhMjIzMDIyMmMyMjYzNjg2MTY5NmU1ZjY5NjQyMjNhMjI2NDZmNzI2MTY0NmYyZDMxMjIyYzIyNjY2NTY1MjIzYTdiMjI2MTZkNmY3NTZlNzQyMjNhNWI1ZDJjMjI2NzYxNzMyMjNhMjIzMDIyN2QyYzIyNmQ2NTZkNmYyMjNhMjIyMjJjMjI2ZDczNjc3MzIyM2E1YjdiMjI3NDc5NzA2NTIyM2EyMjczNjk2NzZlMmY0ZDczNjc1MzY5Njc2ZTQ0NjE3NDYxMjIyYzIyNzY2MTZjNzU2NTIyM2E3YjIyNjQ2MTc0NjEyMjNhMjI2NTc5NGE2YzYyNmQ0ZTc5NjU1ODQyMzA1YTU3NTI1NDVhNTczNTZiNWE1ODRhNDU1OTU4NTI2ODQ5NmE2ZjY5NTE2YzQyNTY2NDZlNjczNTY0MzA2NDZkNjE0ODRhNmE2MjZiNTY2YjUxMzA2NDZiNTc0NTY0NTk1NDQ3NjQ0NTYxNTU3NzdhNjIzMTY4NDk2MjQ2NGE0NzUxNmQ3NDMyNjU0ODY4NGY2MzZiNTY3MjU5MzI0ZDMzNTYzMTRhNmY2MzZkNDY1NjVhNmI0YTQyNGY1NTZiNzk1YTMzNWE0ZTUzNTY0MjU1NTc0NzRhNGU1YTQ4NjQ2ZjYxNzk3NDU1NjU0ODU2NDI2NDQ0NTEzMTY0NmQ2ODZmNTkzMDc0NDc2NDMxNWE3NjU0NmU2MzMwNjU1NjUxMzA2NDQ4NTY1YTRjMzAzNDc2NGU1NjRkMzI1NjU4NmM3NzYxNmE2YzQ4NTQ0NTc0Nzg1OTMxNzA0OTRkMzE0ZTYxNTk1ODRlNTQ1NDQ2NmM1MzUyNDU2Yjc4NTM2YTQyNGQ1NTdhNDYzNDYxNTc0YTQ1NjU1NDY4NDU0ZDQ3NWE2YTUyNDg2NDU5NTQ0NDY4NGI2MzQ3NGE0ZDUxN2E1NjUzNTM1ODRhNzg1YTZjNWE0YzYyNDY0Njc0NTY1NjU2NWE1MzQ0Njc3NzUyMzAzODc4NjU0NzcwNTY2Mzc5NzQ2ZDU3NDc3ODZlNTY2YzcwMzI2MjZhNjg0MzRjMzE0Mjc1NTM2YTQ2NDQ2NTZkNGU2YzUyNDY0YTM0NjIzMzVhNTQ2NDQ2NTUzMjVhMzA3MDRhNTM1NTY4NTY0ZDU2NDY3MjRjMzE0MTMwNTQ0NTc3MzU2NTZjNWE3MjU3NDg0OTMwNTQ1ODRlN2E0ZDQ1MzkzMjYxNTg1MTMxNTU0Mzc0Njk2MjQ0NGUzNjUxNTMzOTUzNjU2YzRlNTQ1NjU4NDY3MjRkNDczOTQ2NGU2YjRlNTQ1YTMzNjQzMjY0NTQ0ZTMyNjM1ODQ2NmM2MzQ0NWE0ZjRjMzIzNTc0NTk2ZDQ1MzM1MzQ0NTkzMTRlNDU2ODU2NjU1NDQ5MzI1MzZlNWE0YzU1N2E1NjMzNGQ2ZDY0NmU0YzdhNTY1NDYzNTQ0YTZjNjM0NzRhNGI2MTU4NTI2ZjY1NDg2NDZlNjI0NzM1NzI1NzU2NTY3ODU2NmQzNTMzNjM1NjY3NzI2NDU1NzA0ZDRjMzI2ODU0NTE3YTUyNTQ1MzMwNGQzMTUzNTc0YTc4NTI2ZTQyNGE1NDU3NWE1MzY1NDg1Njc4NTkzMTRhNGY2NTU4NjgzNDVhNTY0MTc2NGQzMDcwNTY1YTZiNGE0NzRlNTc0ZTczNGU0ODUyNmQ1MzQ4NTI0ZDVhNTUzMTRlNjQ0ODQ1MzI2MzQ0NDYzNTYzNDczOTQ2NjIzMjRhMzY0ZDQ3MzAzNDUzNTg2YzQ1NTQ0ODUxMzE1NjMyNTI2ODUyMzE0MjY4NjI2YTRkMzU1MjMwNjg2YjU3NmI0NjZkNGI3YTY0NzE1MjMwNmM0ZTU0N2E2NDU4NjI0NjUxNzc0ZjU2NDUzMzYxNTczOTc0NjE1NTVhNzg1NzU3NzA2OTUzNDQ1NTMyNjI2YTZiMzQ1MjQ2NmM0YjRkNmI2Zjc2NjE0NTRhNjg2NDMyMzQ3MjVhMzA2Mzc4NGMzMzQ2MzE1NzZlNjg1MTYxMzAzNTQ2NjU1NDQ2NmI1NDQ3NjM3NzUxNTg1Mjc0NWEzMDQ1Nzc1MDUzNDk3MzQ5NmQ1Njc1NTkzMzRhMzU2MzQ4NTI2YzVhNDY1MjY4NjM2ZDY0NmM2NDQ1NTI2ODY0NDc0NTY5NGY2OTRhNDM1MzQ1NzAzNTUxMzM0MjU4NTI0NjQyNTk2MzQ1NTEzMTU0NDc3MDc0NTM0NDRhNjg1OTZiNzczNTYxMzA0ZTU3NTc1NjRlNTk1NDZjNmM1NTYyMzE0NTc4NTM2ZTcwNzM1YTMzNWE0ODYxMzI2ODYxNGU0NTZjNGU2MzMwNTI3ODUxNTU3ODQ3NTc2ZDM1MzQ1MjZlNDI0NTRiMzM2NDQ4NTc1NzRkN2E1NjQzNzQ1NDYxNTY1NTMyNTY2ZDVhNDM2MjQ1NzA3NTU3NDY2NDU4NGY1NzcwNTc0ZTQ0NjQ3YTU0NDc0ZTc4NjE1ODY4NGI2NDMyMzU0MzU0NmQ1MjZmNGIzMjMxNzc1NjMyNzMzMjUzNDY2NDcwNTY0NjRhNjE1NDMyNDk3YTU3NmE1MjQ2NTE1Mzc0NmQ1MzMxNmM0ZDVhNmE1YTdhNTU1NTMxNDI1MjU4NTI2YzYyNDU3ODc5NjU2OTc0NmE1YTQ3NmM0ZjU1NDg1MjU4NjIzMjY0MzE1NjU4NGE2ODU1NTQ0YTdhNjQ0ODU5NzY2MjQ3Njg3NTU2MzI2YzZiNTU2YzRkMzQ1OTZjNTY0NjRkNTg1YTRkNTkzMDc0NTQ1MTMyNzA3MDY1NTc1OTMxNGU0NzVhNzI1NTMwNTI2ZjYxNjk3NDQ5NTI2YTRhNTg1NTZkNTY0ZTUzNmQ2MzMyNGQ0NzQ2MzU1NTZlNmYzNDUyNTU1YTRmNGY1NjQ1MzM2MTMxNjQ3NTY1NTg0ZDc2NGIzMjUyNzg2MjQ3NWE3NjRmNTQ2Yzc0NjQ1NTM5NTQ2NDQ2NTI0MjU1MzM2YjM0NWEzMjc0MzQ0ZjQ3NGE2ZTVhMzM0NjY4NTI0NDQ2NDk2NDZhNDEzMzU2NTg0ZDdhNjE2ZTQyNDM2MzQ1MzEzNDUxNmU0MjVhNjQ2ZDMxNTM0ZDMyNDkzMjRlMzM0ZDM0NWE0NzY0NDI2MzQ1NWE1MjU2NmQ0YTdhNTM2YjRlNGM1YTQ3NjQ3MTRjMzA0YTZlNGMzMDczMzE2NDQ4NzA2ZTU5NTg1MjU1NTM1ODUyNTc1YTMyNzczNTU1NDQ1NTc2NjQ1NTQ2MzQ0ZjU4NDI2YTU5N2E1YTU4NTUzMTcwNzA1NDZkNGE1NDUxNTQ0ZTZjNGQzMzZjNzg1OTZkNWE1MjYyN2E2ODMyNGQ2ZDVhNjk1OTMyNjQ1MjU0NmI2Mzc4NWEzMDMxNDk2MjMzNjQ0MzY1NmI1YTY4NjQ0NTU5Nzk1OTU2NjMzNTY0MzM3MDUzNjE2YjM1NzA1MjQ1NDY0ODUxNTU0ZTcwNTYzMTQyNTI1MjMwMzE0ZTRkNTU1Mjc5NjU0NDVhNDY1YTZiNjczMDU2NTU2MzMzNjU2ZDcwMzY2NDdhNDU3NjY0NTQ1MjU1NjQ1NjQyNmE1MjU3MzQzMzUyNTQ0NTc4NjE2ZTVhNWE2NDZiNzg2YjY0N2E1YTRiNTM2YjY4NGM2NTQ1MzU3NjU2MzI0NTM0NTM1NTUyNzQ0YjMyNjQzMDY1NTY0ZTZkNTc2ZTRlNTM2MzU3MzU2YjVhNDg1Mjc5NTIzMTVhNmI1NjU0NDY3NTRjMzE0OTM0NWEzMjcwNzk2MzZjNGU2ZjU0NDQ2ODU3NjU0Nzc4NGQ1MzZkNWE2ZDYyMzE2NzdhNGIzMzQyMzM0ZjQ4NjMzOTQ5NmUzMDNkMjIyYzIyNzM2OTY3NmU2NTcyMjIzYTIyNjY2NTc0NjM2ODMxNzM3NjM4MzQzOTM0NjQ2NDZhNjc3YTY4NzE2NzM4MzAzODc1NmQ2Mzc0N2E2YzM1MzM3NTc5NzQ3MTM1MzA3MTZhNmI2YTc2NjY3MjIyN2Q3ZDVkMmMyMjczNjU3MTc1NjU2ZTYzNjUyMjNhMjIzMDIyN2QiLCJzZW5kZXJQdWJsaWNLZXkiOiIwMjM3NGU4NTNiODNmOTlmNTE2Y2FlZjRlZTExN2E2M2JjOTBhMjBhODlhMDkyOWI4ZDU0OWY0NjU2OGM2M2ZmNjUiLCJkZXN0aW5hdGlvblB1YmxpY0tleSI6IjAyMzI2OWMwYTllZjI1OTdlNzM5MTcxODg3ZDYyZmQ0NmM0OTZiNGMxZWY3M2FmNDFlNzJmMDZlOWQxN2ZmYzljMSIsInNpZ25hdHVyZSI6InRlc3Qgc2lnbmF0dXJlIn0=",
    expiryTimestamp: 1664867326784,
    id: "711fa8ec-3144-4517-9967-55b79b07afbd",
    sender: "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
    target: "fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc",
  },
};

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
  const inputVal=props.inputVal

  console.log("inputVal in new user",inputVal);
  
  
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
  const recipientConfig = useRecipientConfig(
    chainStore,
    selectedChainId,
    EthereumEndpoint
  );
  const isENSAddress = ObservableEnsFetcher.isValidENS(
    "absa"
  );
  const error = recipientConfig.getError();
  console.log("isENSAddress",isENSAddress,"error ",error);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setAddresses(
      addresses.filter((address: any) => address.name.includes(inputVal))
    );
    console.log("recipientConfig",recipientConfig);
    
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
          console.log("address address in new component", address);
          return <NewUser address={address} inputVal={inputVal}/>;
        })}
      </div>
    </HeaderLayout>
  );
};


