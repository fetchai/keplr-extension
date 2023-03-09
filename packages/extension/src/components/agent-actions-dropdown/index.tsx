import React from "react";
import style from "./style.module.scss";
import sendTokenIcon from "@assets/icon/send-token.png";
import claimTokenIcon from "@assets/icon/claim-token.png";
import autoCompoundIcon from "@assets/icon/auto-compound.png";
export const AgentActionsDropdown = ({
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
          <CommandOption
            title={"Transfer FET"}
            icon={sendTokenIcon}
            handleClick={() => handleClick("/transferFET")}
          />
          <CommandOption
            title={"Send Token"}
            icon={sendTokenIcon}
            handleClick={() => handleClick("/sendToken")}
          />
          <CommandOption
            title={"Auto-Compound Rewards"}
            icon={autoCompoundIcon}
            handleClick={() => handleClick("/autoCompound")}
          />
          <CommandOption
            title={"Claim Token"}
            icon={claimTokenIcon}
            handleClick={() => handleClick("/claimToken")}
          />
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
