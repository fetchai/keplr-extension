import { store } from "@chatStore/index";
import { setGroups, userChatGroups } from "@chatStore/messages-slice";
import { newGroupDetails, setNewGroupInfo } from "@chatStore/new-group-slice";
import { userDetails } from "@chatStore/user-slice";
import {
  CommonPopupOptions,
  Group,
  GroupChatMemberOptions,
  GroupDetails,
  GroupMembers,
  Groups,
  NewGroupDetails,
} from "@chatTypes";
import { AlertPopup } from "@components/chat-actions-popup/alert-popup";
import { ChatLoader } from "@components/chat-loader";
import { ChatMember } from "@components/chat-member";
import { GroupChatPopup } from "@components/group-chat-popup";
import { useLoadingIndicator } from "@components/loading-indicator";
import { createGroup } from "@graphQL/groups-api";
import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { HeaderLayout } from "@layouts/index";
import amplitude from "amplitude-js";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { EthereumEndpoint } from "../../../config.ui";
import { useStore } from "../../../stores";
import { encryptGroupMessage, GroupMessageType } from "@utils/encrypt-group";
import { fetchPublicKey } from "@utils/fetch-public-key";
import { formatAddress } from "@utils/format";
import {
  decryptEncryptedSymmetricKey,
  encryptSymmetricKey,
} from "@utils/symmetric-key";
import style from "./style.module.scss";
import { recieveMessages } from "@graphQL/recieve-messages";
import {
  addAdminEvent,
  removedAdminEvent,
  removeMemberEvent,
} from "@utils/group-events";

export const EditMember: FunctionComponent = observer(() => {
  const history = useHistory();
  const loadingIndicator = useLoadingIndicator();

  const user = useSelector(userDetails);

  /// For updating the current group
  const newGroupState: NewGroupDetails = useSelector(newGroupDetails);
  const [selectedMembers, setSelectedMembers] = useState<GroupMembers[]>(
    newGroupState.group.members || []
  );

  /// Group Info
  const groups: Groups = useSelector(userChatGroups);
  const group: Group = groups[newGroupState.group.groupId];

  /// Displaying list of addresses along with name
  const [addresses, setAddresses] = useState<any[]>([]);

  /// Selected member info for displaying the dynamic popup
  const [selectedAddress, setSelectedAddresse] = useState<any>();
  const [confirmAction, setConfirmAction] = useState(false);

  /// Show alert popup for remove member
  const [removeMemberPopup, setRemoveMemberPopup] = useState(false);

  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountInfo.bech32Address;
  const userGroupAddress = group.addresses.find(
    (address) => address.address == walletAddress
  );
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

  const updateUserAddresses = (members: GroupMembers[]) => {
    /// Todo: handle it in better way
    const userAddresses: any = members
      .map((element) => {
        const addressData = addressBookConfig.addressBookDatas.find(
          (data) => data.address === element.address
        );

        if (addressData)
          return {
            name: addressData.name,
            address: addressData.address,
            existsInAddressBook: true,
          };

        return {
          name: element.address,
          address: element.address,
          existsInAddressBook: false,
        };
      })
      .filter((element) => element.address !== walletAddress);

    setAddresses([
      ...userAddresses,
      {
        name: "You",
        address: walletAddress,
        existsInAddressBook: false,
      },
    ]);
  };

  useEffect(() => {
    updateUserAddresses(selectedMembers);

    /// Adding login user into the group list
    handleAddRemoveMember(
      walletAddress,
      group.addresses.find((element) => element.address === walletAddress)
        ?.isAdmin ?? false
    );
  }, [addressBookConfig.addressBookDatas]);

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
        //get symmetricKey of group using
        const symmetricKey = await decryptEncryptedSymmetricKey(
          current.chainId,
          userGroupAddress?.encryptedSymmetricKey || ""
        );
        const encryptedSymmetricKey = await encryptSymmetricKey(
          current.chainId,
          user.accessToken,
          symmetricKey,
          contactAddress
        );
        const tempMember: GroupMembers = {
          address: contactAddress,
          pubKey: pubAddr.publicKey,
          encryptedSymmetricKey,
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

  function showRemoveMemberPopup(action: CommonPopupOptions) {
    setRemoveMemberPopup(false);
    if (!selectedAddress) {
      return;
    }

    if (action === CommonPopupOptions.ok) {
      removeMember(selectedAddress.address);
    }
  }

  const removeMember = async (contactAddress: string) => {
    loadingIndicator.setIsLoading("group-action", true);

    const tempMembers = selectedMembers.filter(
      (item) => item.address !== contactAddress
    );

    try {
      const contents = await encryptGroupMessage(
        current.chainId,
        removeMemberEvent(contactAddress),
        GroupMessageType.event,
        userGroupAddress?.encryptedSymmetricKey || "",
        accountInfo.bech32Address,
        newGroupState.group.groupId,
        user.accessToken
      );
      const updatedGroupInfo: GroupDetails = {
        description: group.description ?? "",
        groupId: group.id,
        contents: contents,
        members: tempMembers,
        name: group.name,
        onlyAdminMessages: false,
      };
      const tempGroup = await createGroup(updatedGroupInfo);

      if (tempGroup) {
        /// Updating the UI
        updateUserAddresses(tempMembers);
        /// updating the new updated group
        store.dispatch(setNewGroupInfo({ contents, members: tempMembers }));
        /// update state of selected member
        setSelectedMembers(tempMembers);

        /// updating the group(chat history) object
        const groups: any = { [tempGroup.id]: tempGroup };
        store.dispatch(setGroups({ groups }));

        /// fetching the group messages again
        await recieveMessages(group.id, null, 0, group.isDm, group.id);
      }
    } catch (e) {
      // Show error toaster
      console.error("error", e);
    } finally {
      loadingIndicator.setIsLoading("group-action", false);
    }
  };

  const updateAdminStatus = async (
    contactAddress: string,
    isAdmin: boolean
  ) => {
    const tempMember: GroupMembers | undefined = selectedMembers.find(
      (element) => element.address === contactAddress
    );

    if (tempMember) {
      loadingIndicator.setIsLoading("group-action", true);

      const updatedMember: GroupMembers = {
        address: tempMember.address,
        pubKey: tempMember.pubKey,
        encryptedSymmetricKey: tempMember.encryptedSymmetricKey,
        isAdmin: isAdmin || false,
      };

      const newMembers = selectedMembers.filter(
        (item) => item.address !== contactAddress
      );
      const tempMembers = [...newMembers, updatedMember];
      const statement = isAdmin
        ? addAdminEvent(contactAddress)
        : removedAdminEvent(contactAddress);
      const contents = await encryptGroupMessage(
        current.chainId,
        statement,
        GroupMessageType.event,
        userGroupAddress?.encryptedSymmetricKey || "",
        accountInfo.bech32Address,
        newGroupState.group.groupId,
        user.accessToken
      );
      const updatedGroupInfo: GroupDetails = {
        description: group.description ?? "",
        groupId: group.id,
        contents: contents,
        members: tempMembers,
        name: group.name,
        onlyAdminMessages: false,
      };

      try {
        const tempGroup = await createGroup(updatedGroupInfo);

        if (tempGroup) {
          /// updating the new updated group
          store.dispatch(setNewGroupInfo({ contents, members: tempMembers }));
          setSelectedMembers(tempMembers);

          /// updating the group(chat history) object
          const groups: any = { [tempGroup.id]: tempGroup };
          store.dispatch(setGroups({ groups }));

          /// fetching the group messages again
          await recieveMessages(group.id, null, 0, group.isDm, group.id);
        }
      } catch (e) {
        // Show error toaster
        console.error("error", e);
      } finally {
        loadingIndicator.setIsLoading("group-action", false);
      }
    }
  };

  const AddContactOption = (address: string) => {
    amplitude.getInstance().logEvent("Add to address click", {});
    history.push({
      pathname: "/setting/address-book",
      state: {
        openModal: true,
        addressInputValue: address,
      },
    });
  };

  function showGroupPopup(address: any): void {
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

      case GroupChatMemberOptions.removeMember:
        setRemoveMemberPopup(true);
        break;

      case GroupChatMemberOptions.makeAdminStatus:
        updateAdminStatus(selectedAddress.address, true);
        break;

      case GroupChatMemberOptions.removeAdminStatus:
        updateAdminStatus(selectedAddress.address, false);
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
      <div className={style.group}>
        <div className={style.groupContainer}>
          <div className={style.groupHeader}>
            <span className={style.groupName}>{newGroupState.group.name}</span>
            <span className={style.groupMembers}>
              {`${selectedMembers.length} member${
                selectedMembers.length > 1 ? "s" : ""
              }`}
              <i
                className={"fa fa-user-plus"}
                style={{
                  width: "24px",
                  height: "24px",
                  padding: "2px 0 0 12px",
                  cursor: "pointer",
                  alignItems: "end",
                  alignSelf: "end",
                }}
                aria-hidden="true"
                onClick={() => {
                  history.push({
                    pathname: "/chat/group-chat/add-member",
                  });
                }}
              />
            </span>
          </div>
        </div>
        <span className={style.groupDescription}>
          {newGroupState.group.description}
        </span>
        {!addressBookConfig.isLoaded ? (
          <ChatLoader message="Loading contacts, please wait..." />
        ) : (
          <div className={style.newMemberContainer}>
            <div className={style.membersContainer}>
              {addresses.map((address: any) => {
                return (
                  <ChatMember
                    address={address}
                    key={address.address}
                    isShowAdmin={
                      selectedMembers.find(
                        (element) => element.address === address.address
                      )?.isAdmin ?? false
                    }
                    showPointer
                    showSelectedIcon={false}
                    onClick={() => showGroupPopup(address)}
                  />
                );
              })}
            </div>
          </div>
        )}
        {removeMemberPopup && (
          <AlertPopup
            setConfirmAction={setConfirmAction}
            heading={`Remove ${formatAddress(selectedAddress?.name ?? "")}`}
            description={`${formatAddress(
              selectedAddress?.name ?? ""
            )} will no longer receive messages from this group. \nThe group will be notified that they have been removed.`}
            firstButtonTitle="Cancel"
            secondButtonTitle="Remove"
            onClick={(action) => {
              showRemoveMemberPopup(action);
            }}
          />
        )}
        {confirmAction && (
          <GroupChatPopup
            isAdded={selectedAddress.existsInAddressBook}
            isFromReview={false}
            name={selectedAddress?.name ?? ""}
            selectedMember={selectedMembers.find(
              (element) => element.address === selectedAddress?.address
            )}
            isLoginUserAdmin={
              group.addresses.find(
                (element) => element.address === walletAddress
              )?.isAdmin ?? false
            }
            onClick={(action) => {
              handlePopupAction(action);
            }}
          />
        )}
      </div>
    </HeaderLayout>
  );
});
