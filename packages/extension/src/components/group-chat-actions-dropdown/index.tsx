import { GroupChatOptions } from "@chatTypes";
import React from "react";
import style from "./style.module.scss";

export const GroupChatActionsDropdown = ({
  showDropdown,
  handleClick,
}: {
  showDropdown: boolean;
  handleClick: (options: GroupChatOptions) => void;
}) => {
  return (
    <>
      {showDropdown && (
        <div className={style.dropdown}>
          <Option
            title="Group info"
            onClick={() => handleClick(GroupChatOptions.groupInfo)}
          />
          <Option
            title="Mute group"
            onClick={() => handleClick(GroupChatOptions.muteGroup)}
          />
          <Option
            title="Leave group"
            onClick={() => handleClick(GroupChatOptions.leaveGroup)}
          />
          <Option
            title="Delete group"
            onClick={() => handleClick(GroupChatOptions.deleteGroup)}
          />
          <Option
            title="Chat settings"
            onClick={() => handleClick(GroupChatOptions.chatSettings)}
          />
        </div>
      )}
    </>
  );
};

const Option = ({ title, onClick }: { title: string; onClick: () => void }) => {
  return <div onClick={() => onClick()}>{title}</div>;
};
