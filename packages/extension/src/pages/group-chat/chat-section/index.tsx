/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../../../stores";
import { ChatErrorPopup } from "@components/chat-error-popup";
import { ChatLoader } from "@components/chat-loader";
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
import { useNotification } from "@components/notification";

export const GroupChatSection: FunctionComponent = () => {
  const notification = useNotification();
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
  const [loadingChats, setLoadingChats] = useState(false);
  const [action, setAction] = useState("");

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

      case GroupChatOptions.leaveGroup:
        notification.push({
          type: "warning",
          placement: "top-center",
          duration: 5,
          content: `Under-Development`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
        break;

      default:
        setAction(option.toString());
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
        {loadingChats ? (
          <ChatLoader message="Arranging messages, please wait..." />
        ) : (
          <div>
            <UserNameSection
              handleDropDown={handleDropDown}
              groupName={group.name}
            />

            <GroupChatActionsDropdown
              showDropdown={showDropdown}
              isAdmin={isAdmin}
              handleClick={handleClick}
            />

            <GroupChatsViewSection
              setLoadingChats={setLoadingChats}
              handleClick={handleClick}
            />

            {confirmAction && (
              <ChatActionsPopup
                action={action}
                setConfirmAction={setConfirmAction}
              />
            )}
          </div>
        )}
      </HeaderLayout>
    </div>
  );
};
