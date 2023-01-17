import { fromBech32 } from "@cosmjs/encoding";
import { PrivacySetting } from "@keplr-wallet/background/build/messaging/types";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { Bech32Address } from "@keplr-wallet/cosmos";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import jazzicon from "@metamask/jazzicon";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { GroupMembers, NameAddress, NewGroupDetails } from "@chatTypes";
import { userDetails } from "@chatStore/user-slice";
import { ChatLoader } from "@components/chat-loader";
import { ChatMember } from "@components/chat-member";
import { EthereumEndpoint } from "../../../config.ui";
import { HeaderLayout } from "@layouts/index";
import searchIcon from "@assets/icon/search.png";
import { useStore } from "../../../stores";
import { formatAddress } from "../../../utils/format";
import style from "./style.module.scss";
import { newGroupDetails, setNewGroupInfo } from "@chatStore/new-group-slice";
import { store } from "@chatStore/index";
import { fetchPublicKey } from "../../../utils/fetch-public-key";
import { Button } from "reactstrap";

export const AddMember: FunctionComponent = observer(() => {
  const history = useHistory();
  const user = useSelector(userDetails);
  const newGroupState: NewGroupDetails = useSelector(newGroupDetails);
  const [selectedMembers, setSelectedMembers] = useState<GroupMembers[]>(
    newGroupState.group.members || []
  );

  const [inputVal, setInputVal] = useState("");
  const [addresses, setAddresses] = useState<NameAddress[]>([]);
  const [randomAddress, setRandomAddress] = useState<NameAddress | undefined>();

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

  const userAddresses: NameAddress[] = addressBookConfig.addressBookDatas.map(
    (data) => {
      return { name: data.name, address: data.address };
    }
  );

  useEffect(() => {
    setAddresses(userAddresses.filter((a) => a.address !== walletAddress));

    /// Adding login user into the list
    handleAddRemoveMember(walletAddress, true);
  }, [addressBookConfig.addressBookDatas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    const searchedVal = e.target.value.toLowerCase();
    const addresses = userAddresses.filter(
      (address: NameAddress) =>
        address.address !== walletAddress &&
        (address.name.toLowerCase().includes(searchedVal) ||
          address.address.toLowerCase().includes(searchedVal))
    );

    if (
      addresses.length === 0 &&
      searchedVal &&
      searchedVal !== walletAddress &&
      user?.messagingPubKey.privacySetting === PrivacySetting.Everybody
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
        setRandomAddress(address);
        setAddresses([]);
        // setAddresses([address]);
      } catch (e) {
        setAddresses([]);
        setRandomAddress(undefined);
      }
    } else {
      setRandomAddress(undefined);
      setAddresses(addresses);
    }
  };

  const isMemberExist = (contactAddress: string) =>
    !!selectedMembers.find((element) => element.address === contactAddress);

  const handleAddRemoveMember = async (
    contactAddress: string,
    isAdmin?: boolean
  ) => {
    if (!isMemberExist(contactAddress)) {
      const pubAddr = await fetchPublicKey(
        user.accessToken,
        current.chainId,
        contactAddress
      );

      if (pubAddr && pubAddr.publicKey) {
        const tempMember: GroupMembers = {
          address: contactAddress,
          pubKey: pubAddr.publicKey,
          encryptedSymmetricKey: "",
          isAdmin: isAdmin || false,
        };

        const tempMembers = [...selectedMembers, tempMember];

        store.dispatch(setNewGroupInfo({ members: tempMembers }));
        setSelectedMembers(tempMembers);
      }
    } else {
      const tempMembers = selectedMembers.filter(
        (item) => item.address !== contactAddress
      );
      store.dispatch(setNewGroupInfo({ members: tempMembers }));
      setSelectedMembers(tempMembers);
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"New Group Chat"}
      onBackButton={() => {
        history.goBack();
      }}
    >
      {!addressBookConfig.isLoaded ? (
        <ChatLoader message="Loading contacts, please wait..." />
      ) : (
        <div className={style.newMemberContainer}>
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
          <div className={style.membersContainer}>
            {randomAddress && (
              <ChatMember
                address={randomAddress}
                key={randomAddress.address}
                isSelected={isMemberExist(randomAddress.address)}
                onIconClick={() => handleAddRemoveMember(randomAddress.address)}
              />
            )}
            {addresses.map((address: NameAddress) => {
              return (
                <ChatMember
                  address={address}
                  key={address.address}
                  isSelected={isMemberExist(address.address)}
                  onIconClick={() => handleAddRemoveMember(address.address)}
                />
              );
            })}
          </div>
          {addresses.length === 0 && !randomAddress && (
            <div>
              <div className={style.resultText}>
                No results in your contacts.
              </div>
              {user?.messagingPubKey.privacySetting ===
                PrivacySetting.Contacts && (
                <div className={style.resultText}>
                  If you are searching for an address not in your address book,
                  you can&apos;t see them due to your selected privacy settings
                  being &quot;contact only&quot;. Please add the address to your
                  address book to be able to chat with them or change your
                  privacy settings.
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
              )}
            </div>
          )}
        </div>
      )}
      <div className={style.groupContainer}>
        <div className={style.initials}>
          {ReactHtmlParser(
            jazzicon(
              24,
              parseInt(fromBech32(walletAddress).data.toString(), 16)
            ).outerHTML
          )}
          <div className={style.groupHeader}>
            <span className={style.groupName}>{newGroupState.group.name}</span>
            <span className={style.memberTotal}>
              {selectedMembers.length} member
            </span>
          </div>
        </div>

        <Button
          className={style.button}
          size="large"
          onClick={() => {
            history.push("/group-chat/review-details");
          }}
        >
          Review
        </Button>
      </div>
    </HeaderLayout>
  );
});
