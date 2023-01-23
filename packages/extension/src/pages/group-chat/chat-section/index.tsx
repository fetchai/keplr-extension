/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../../../stores";
import { ChatErrorPopup } from "@components/chat-error-popup";
import { SwitchUser } from "@components/switch-user";
import { HeaderLayout } from "@layouts/index";
import { Menu } from "../../main/menu";
import { UserNameSection } from "./username-section";
import { GroupChatsViewSection } from "./chats-view-section";
import { ChatActionsPopup } from "@components/chat-actions-popup";
import { useSelector } from "react-redux";
import { userChatGroups } from "@chatStore/messages-slice";
import { GroupChatOptions, GroupMembers, Groups } from "@chatTypes";
import { GroupChatActionsDropdown } from "@components/group-chat-actions-dropdown";
import { store } from "@chatStore/index";
import { setIsGroupEdit, setNewGroupInfo } from "@chatStore/new-group-slice";

export const GroupChatSection: FunctionComponent = () => {
  const history = useHistory();
  const groupId = history.location.pathname.split("/")[3];
  const groups: Groups = useSelector(userChatGroups);
  const group = groups[groupId];

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountInfo.bech32Address;

  const isAdmin =
    group.addresses.find((element) => element.address === walletAddress)
      ?.isAdmin ?? false;

  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [isMemberRemoved, setMemberRemoved] = useState(false);
  const [action, setAction] = useState("");

  useEffect(() => {
    /// Find the current user and check user exists in the group or not
    const currentUser = group.addresses.find(
      (element) => element.address === accountInfo.bech32Address
    );

    if (group?.removedAt) {
      /// User is removed by admin
      setMemberRemoved(true);
    } else if (!currentUser && !isMemberRemoved) {
      /// User removed from group address array
      setMemberRemoved(true);
    } else if (currentUser && isMemberRemoved) {
      setMemberRemoved(false);
    }
  }, [groups]);

  const handleDropDown = () => {
    setShowDropdown(!showDropdown);
  };

  function navigateToPage(page: string) {
    const members: GroupMembers[] = group.addresses.map((element) => {
      return {
        address: element.address,
        pubKey: element.pubKey,
        encryptedSymmetricKey: element.encryptedSymmetricKey,
        isAdmin: element.isAdmin,
      };
    });
    store.dispatch(
      setNewGroupInfo({
        description: group.description,
        groupId: group.id,
        members: members,
        name: group.name,
      })
    );
    store.dispatch(setIsGroupEdit(true));
    history.push(page);
  }

  const handleClick = (option: GroupChatOptions) => {
    setShowDropdown(false);
    switch (option) {
      case GroupChatOptions.groupInfo:
        navigateToPage("/group-chat/review-details");
        break;

      case GroupChatOptions.chatSettings:
        navigateToPage("/group-chat/create");
        break;

      case GroupChatOptions.deleteGroup:
        setAction("deleteGroup");
        setConfirmAction(true);
        break;

      case GroupChatOptions.leaveGroup:
      default:
        debugger;
        setAction(GroupChatOptions[option]);
        setConfirmAction(true);
        break;
    }
  };

  return (
    <div
      onClick={() => {
        if (showDropdown) {
          handleDropDown();
        }
      }}
    >
      <HeaderLayout
        showChainName={true}
        canChangeChainInfo={true}
        menuRenderer={<Menu />}
        rightRenderer={<SwitchUser />}
      >
        <ChatErrorPopup />
        <div>
          <UserNameSection
            handleDropDown={handleDropDown}
            groupName={group.name}
          />

          <GroupChatActionsDropdown
            isMemberRemoved={isMemberRemoved}
            showDropdown={showDropdown}
            isAdmin={isAdmin}
            handleClick={handleClick}
          />

          <GroupChatsViewSection isMemberRemoved={isMemberRemoved} />

          {confirmAction && (
            <ChatActionsPopup
              action={action}
              setConfirmAction={setConfirmAction}
            />
          )}
        </div>
      </HeaderLayout>
    </div>
  );
};
