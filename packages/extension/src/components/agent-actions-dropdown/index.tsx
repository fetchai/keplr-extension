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
          <SendTokenOption handleClick={handleClick} />
          <AutoCompoundOption handleClick={handleClick} />
          <ClaimTokenOption handleClick={handleClick} />
        </div>
      )}
    </>
  );
};

const SendTokenOption = ({
  handleClick,
}: {
  handleClick: (data: string) => void;
}) => {
  return (
    <div onClick={() => handleClick("/sendToken")}>
      <img src={sendTokenIcon} alt="" draggable="false" /> Send Token
    </div>
  );
};

const AutoCompoundOption = ({
  handleClick,
}: {
  handleClick: (data: string) => void;
}) => {
  return (
    <div onClick={() => handleClick("/autoCompound")}>
      <img src={autoCompoundIcon} alt="" draggable="false" /> Auto-Compound
      Rewards
    </div>
  );
};

const ClaimTokenOption = ({
  handleClick,
}: {
  handleClick: (data: string) => void;
}) => {
  return (
    <div onClick={() => handleClick("/claimToken")}>
      <img src={claimTokenIcon} alt="" draggable="false" /> Claim Token
    </div>
  );
};
