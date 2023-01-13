import { GroupChatOptions } from "@chatTypes";
import React from "react";
import style from "./style.module.scss";

export const GroupChatActionsDropdown = ({
  showDropdown,
  handleClick,
}: {
  showDropdown: boolean;
  handleClick: (option: GroupChatOptions) => void;
}) => {
  const options = [
    { title: "Group info", option: GroupChatOptions.groupInfo },
    { title: "Mute group", option: GroupChatOptions.muteGroup },
    { title: "Leave group", option: GroupChatOptions.leaveGroup },
    { title: "Delete group", option: GroupChatOptions.deleteGroup },
    { title: "Chat settings", option: GroupChatOptions.chatSettings },
  ];

  return (
    <>
      {showDropdown && (
        <div className={style.dropdown}>
          {options.map(({ title, option }) => (
            <Option
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

const Option = ({ title, onClick }: { title: string; onClick: () => void }) => {
  return <div onClick={() => onClick()}>{title}</div>;
};
