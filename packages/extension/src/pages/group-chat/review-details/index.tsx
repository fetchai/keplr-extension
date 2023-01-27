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
import {
  Group,
  GroupChatMemberOptions,
  GroupMembers,
  Groups,
  NameAddress,
  NewGroupDetails,
} from "@chatTypes";
import { useSelector } from "react-redux";
import {
  newGroupDetails,
  resetNewGroup,
  setNewGroupInfo,
} from "@chatStore/new-group-slice";
import { store } from "@chatStore/index";
import { createGroup } from "@graphQL/groups-api";
import { Button } from "reactstrap";
import { setGroups, userChatGroups } from "@chatStore/messages-slice";
import { createEncryptedSymmetricKeyForAddresses } from "@utils/symmetric-key";
import { userDetails } from "@chatStore/user-slice";
import { encryptGroupMessage, GroupMessageType } from "@utils/encrypt-group";
import amplitude from "amplitude-js";
import { GroupChatPopup } from "@components/group-chat-popup";

export const ReviewGroupChat: FunctionComponent = observer(() => {
  const history = useHistory();

  const newGroupState: NewGroupDetails = useSelector(newGroupDetails);
  const selectedMembers: GroupMembers[] = newGroupState.group.members || [];
  const user = useSelector(userDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<NameAddress[]>([]);

  const groups: Groups = useSelector(userChatGroups);
  const group: Group = groups[newGroupState.group.groupId];
  const [selectedAddress, setSelectedAddresse] = useState<NameAddress>();
  const [confirmAction, setConfirmAction] = useState(false);

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
    const userAddresses: NameAddress[] = selectedMembers.map((element) => {
      const addressData = addressBookConfig.addressBookDatas.find(
        (data) => data.address === element.address
      );

      if (addressData && addressData.address !== walletAddress)
        return {
          name: addressData.name,
          address: addressData.address,
        };

      return {
        name: element.address === walletAddress ? "You" : element.address,
        address: element.address,
      };
    });

    setAddresses(userAddresses);
  }, [addressBookConfig.addressBookDatas]);

  const handleRemoveMember = async (contactAddress: string) => {
    const tempAddresses = selectedMembers.filter(
      (item) => item.address !== contactAddress
    );
    store.dispatch(setNewGroupInfo({ members: tempAddresses }));
    setAddresses(addresses.filter((item) => item.address !== contactAddress));
  };

  const isUserAdmin = (address: string): boolean => {
    return (
      selectedMembers.find((element) => element.address === address)?.isAdmin ??
      false
    );
  };

  /// check login user is admin and part of group
  const isLoginUserAdmin = (): boolean => {
    const groupAddress = group.addresses.find(
      (element) => element.address === walletAddress
    );
    if (groupAddress) {
      return groupAddress.isAdmin && !groupAddress.removedAt;
    }

    return false;
  };

  const AddContactOption = (address: string) => {
    const history = useHistory();
    return (
      <div
        onClick={() => {
          amplitude.getInstance().logEvent("Add to address click", {});
          history.push({
            pathname: "/setting/address-book",
            state: {
              openModal: true,
              addressInputValue: address,
            },
          });
        }}
      >
        Add to address book
      </div>
    );
  };
  function showGroupPopup(address: NameAddress): void {
    if (address.address !== walletAddress) {
      setSelectedAddresse(address);
      setConfirmAction(true);
    }
  }
  function handlePopupAction(action: GroupChatMemberOptions) {
    setConfirmAction(false);

    if (!selectedAddress) {
      return;
    }

    switch (action) {
      case GroupChatMemberOptions.messageMember:
        amplitude.getInstance().logEvent("Open DM click", {
          from: "Group Info",
        });
        history.push(`/chat/${selectedAddress.address}`);
        break;

      case GroupChatMemberOptions.addToAddressBook:
        AddContactOption(selectedAddress.address);
        break;

      case GroupChatMemberOptions.viewInAddressBook:
        history.push("/setting/address-book");
        break;
    }
  }

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"New Group Chat"}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.tokens}>
        <img
          className={style.groupImage}
          src={require("@assets/group710.svg")}
        />
        <span className={style.groupDescription}>
          {newGroupState.group.name}
        </span>
        <span className={style.groupDescription}>
          {newGroupState.group.description}
        </span>
        {newGroupState.isEditGroup && isUserAdmin(walletAddress) && (
          <Button
            className={style.button}
            size="large"
            onClick={async () => {
              history.push("/chat/group-chat/edit-member");
            }}
          >
            Edit Chat Settings
          </Button>
        )}
      </div>
      <div className={style.membersContainer}>
        {
          <text className={style.memberText}>
            {selectedMembers.length} member
            {selectedMembers.length > 1 ? "s" : ""}
          </text>
        }

        {addresses.map((address: NameAddress) => {
          return (
            <ChatMember
              address={address}
              key={address.address}
              /// showSelectedIcon: isEditGroup true means remove the cross icon
              showSelectedIcon={!newGroupState.isEditGroup}
              isSelected={true}
              isShowAdmin={isUserAdmin(address.address)}
              showPointer
              onClick={() => showGroupPopup(address)}
              onIconClick={() => {
                handleRemoveMember(address.address);
              }}
            />
          );
        })}
      </div>
      {!newGroupState.isEditGroup && (
        <Button
          className={style.button}
          size="large"
          data-loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const updatedGroupMembers = await createEncryptedSymmetricKeyForAddresses(
              newGroupState.group.members,
              current.chainId,
              user.accessToken
            );
            const userGroupAddress = updatedGroupMembers.find(
              (address) => address.address == accountInfo.bech32Address
            );
            const encryptedSymmetricKey =
              userGroupAddress?.encryptedSymmetricKey || "";
            const contents = await encryptGroupMessage(
              current.chainId,
              `Group created by -${accountInfo.bech32Address}`,
              GroupMessageType.event,
              encryptedSymmetricKey,
              accountInfo.bech32Address,
              `Group created by -${
                accountInfo.bech32Address
              } at ${new Date().getTime()}`,
              user.accessToken
            );

            const newGroupData = {
              ...newGroupState.group,
              members: updatedGroupMembers,
              contents,
            };
            const group = await createGroup(newGroupData);
            setIsLoading(false);

            if (group) {
              store.dispatch(resetNewGroup());
              const groups: any = { [group.id]: group };
              store.dispatch(setGroups({ groups }));
              /// Clearing stack till chat tab
              history.go(-4);
              setTimeout(
                () => history.push(`/chat/group-chat-section/${group.id}`),
                100
              );
            }
          }}
        >
          Create Group Chat
        </Button>
      )}
      {confirmAction && !isUserAdmin(walletAddress) && (
        /// Display popup for non admin member
        <GroupChatPopup
          isAdded={
            (selectedAddress &&
              addresses.some((address) => address[selectedAddress.address])) ??
            false
          }
          isFromReview={true}
          name={selectedAddress?.name ?? ""}
          selectedMember={selectedMembers.find(
            (element) => element.address === selectedAddress?.address
          )}
          isLoginUserAdmin={isLoginUserAdmin()}
          onClick={(action) => {
            handlePopupAction(action);
          }}
        />
      )}
    </HeaderLayout>
  );
});
