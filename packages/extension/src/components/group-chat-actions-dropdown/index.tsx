import { GroupChatOptions } from "@chatTypes";
import { ChatOption } from "@components/chat-option";
import React from "react";
import style from "./style.module.scss";

export const GroupChatActionsDropdown = ({
  showDropdown,
  handleClick,
  isAdmin,
}: {
  showDropdown: boolean;
  isAdmin: boolean;
  handleClick: (option: GroupChatOptions) => void;
}) => {
  const options = [
    { title: "Group info", option: GroupChatOptions.groupInfo },
    //{ title: "Mute group", option: GroupChatOptions.muteGroup },
    { title: "Leave group", option: GroupChatOptions.leaveGroup },
    // { title: "Delete group", option: GroupChatOptions.deleteGroup },
  ];

  if (isAdmin) {
    options.push({
      title: "Chat settings",
      option: GroupChatOptions.chatSettings,
    });
  }

  return (
    <>
      {showDropdown && (
        <div className={style.dropdown}>
          {options.map(({ title, option }) => (
            <ChatOption
              key={title}
              title={title}
              onClick={() => handleClick(option)}
            />
          ))}
        </div>
      )}
    </>
  );
};
