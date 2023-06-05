import React from "react";
import { AGENT_COMMANDS } from "../../../config.ui.var";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import { userDetails } from "@chatStore/user-slice";

export const CommandsDropdown = ({
  newMessage,
  showDropdown,
  handleClick,
}: {
  newMessage: string;
  showDropdown: boolean;
  handleClick: (data: string) => void;
}) => {
  const { hasFET } = useSelector(userDetails);

  return (
    <>
      {showDropdown && (
        <div
          className={`${style.dropdown} ${hasFET ? style.enabled : style.disabled
            }`}
        >
          {!hasFET && (
            <div
              style={{ fontSize: "10px", color: "red", textAlign: "center" }}
            >
              Insufficient balance to execute automation
            </div>
          )}
          {AGENT_COMMANDS.filter(
            (command) => command.enabled && command.command.includes(newMessage)
          ).map((command) => (
            <CommandOption
              key={command.command}
              title={command.label}
              icon={command.icon}
              handleClick={() => (hasFET ? handleClick(command.command) : null)}
              imageColor={!hasFET ? "#D3D3D3" : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
};

const CommandOption = ({
  title,
  icon,
  handleClick,
  imageColor,
}: {
  title: string;
  icon: string;
  handleClick: () => void;
  imageColor?: string;
}) => {
  return (
    <div onClick={handleClick}>
      <img
        src={icon}
        alt=""
        draggable="false"
        style={{
          filter: imageColor ? `brightness(70%)` : undefined,
          opacity: imageColor ? 0.5 : undefined,
        }}
      />
      {title}
    </div>
  );
};
