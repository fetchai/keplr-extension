import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  useAddressBookConfig,
  useIBCTransferConfig,
} from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  CommonPopupOptions,
  Group,
  GroupChatMemberOptions,
  GroupDetails,
  GroupMembers,
  Groups,
  NameAddress,
  NewGroupDetails,
} from "@chatTypes";
import { userDetails } from "@chatStore/user-slice";
import { ChatLoader } from "@components/chat-loader";
import { ChatMember } from "@components/chat-member";
import { EthereumEndpoint } from "../../../config.ui";
import { HeaderLayout } from "@layouts/index";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import { newGroupDetails, setNewGroupInfo } from "@chatStore/new-group-slice";
import { store } from "@chatStore/index";
import { fetchPublicKey } from "../../../utils/fetch-public-key";
import { GroupChatPopup } from "@components/group-chat-popup";
import amplitude from "amplitude-js";
import { setGroups, userChatGroups } from "@chatStore/messages-slice";
import {
  encryptGroupMessage,
  GroupMessageType,
} from "../../../utils/encrypt-group";
import { createGroup } from "@graphQL/groups-api";
import { useLoadingIndicator } from "@components/loading-indicator";
import { AlertPopup } from "@components/chat-actions-popup/alert-popup";
import { formatAddress } from "../../../utils/format";

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
  const [addresses, setAddresses] = useState<NameAddress[]>([]);

  /// Selected member info for displaying the dynamic popup
  const [selectedAddress, setSelectedAddresse] = useState<NameAddress>();
  const [confirmAction, setConfirmAction] = useState(false);

  /// Show alert popup for remove member
  const [removeMemberPopup, setRemoveMemberPopup] = useState(false);

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

  const updateUserAddresses = () => {
    /// Todo: handle it in better way
    const userAddresses: NameAddress[] = selectedMembers
      .map((element) => {
        const addressData = addressBookConfig.addressBookDatas.find(
          (data) => data.address === element.address
        );

        if (addressData && addressData.address !== walletAddress)
          return {
            name: addressData.name,
            address: addressData.address,
          };

        return {
          name: element.address,
          address: element.address,
        };
      })
      .filter((element) => element.address !== walletAddress);

    setAddresses([
      ...userAddresses,
      {
        name: "You",
        address: walletAddress,
      },
    ]);
  };

  useEffect(() => {
    updateUserAddresses();

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
        //Todo: get symmetricKey of group using
        /*const symmetricKey = await decryptMessageContent(
          chainId,
          encryptedSymmetricKey
        ); */
        //Todo: generateEncryptedSymmetricKeyForAddress needs to be called to get value of encryptedSymmetricKey
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
        `-${contactAddress} has been removed.`,
        GroupMessageType.event,
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
        updateUserAddresses();

        /// updating the new updated group
        store.dispatch(setNewGroupInfo({ contents, members: tempMembers }));
        setSelectedMembers(tempMembers);

        /// updating the group(chat history) object
        const groupsObj: any = {};
        groupsObj[tempGroup.id] = tempGroup;
        store.dispatch(setGroups({ groups: groupsObj }));
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
        ? `-${contactAddress} now an admin.`
        : `-${contactAddress} removed as admin.`;
      const contents = await encryptGroupMessage(
        current.chainId,
        statement,
        GroupMessageType.event,
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
          const groupsObj: any = {};
          groupsObj[tempGroup.id] = tempGroup;
          store.dispatch(setGroups({ groups: groupsObj }));
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
      <div>
        <div className={style.groupContainer}>
          <div className={style.groupHeader}>
            <span className={style.groupName}>{newGroupState.group.name}</span>
            <span
              className={style.groupMembers}
              onClick={() => {
                history.push({
                  pathname: "/group-chat/add-member",
                });
              }}
            >
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
              />
            </span>
          </div>
          <span className={style.groupDescription}>
            {newGroupState.group.description}
          </span>
        </div>
        {!addressBookConfig.isLoaded ? (
          <ChatLoader message="Loading contacts, please wait..." />
        ) : (
          <div className={style.newMemberContainer}>
            <div className={style.membersContainer}>
              {addresses.map((address: NameAddress) => {
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
            )} will no longer receive messages from this group. ${"\n"} ${"\n"} The group will be notified that they have been removed.`}
            firstButtonTitle="Cancel"
            secondButtonTitle="Remove"
            onClick={(action) => {
              showRemoveMemberPopup(action);
            }}
          />
        )}
        {confirmAction && (
          <GroupChatPopup
            isAdded={
              (selectedAddress &&
                addresses.some(
                  (address) => address[selectedAddress.address]
                )) ??
              false
            }
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
