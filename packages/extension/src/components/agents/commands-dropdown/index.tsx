import React from "react";
import { AGENT_COMMANDS } from "../../../config.ui.var";
import style from "./style.module.scss";

export const CommandsDropdown = ({
  showDropdown,
  handleClick,
}: {
  showDropdown: boolean;
  handleClick: (data: string) => void;
}) => {
  return (
    <>
      {showDropdown && (
        <div className={style.dropdown}>
          {AGENT_COMMANDS.filter((command) => command.enabled).map(
            (command) => (
              <CommandOption
                key={command.command}
                title={command.label}
                icon={command.icon}
                handleClick={() => handleClick(command.command)}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

const CommandOption = ({
  title,
  icon,
  handleClick,
}: {
  title: string;
  icon: any;
  handleClick: () => void;
}) => {
  return (
    <div onClick={() => handleClick()}>
      <img src={icon} alt="" draggable="false" /> {title}
    </div>
  );
};
