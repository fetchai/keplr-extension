import React from "react";
import { useHistory } from "react-router";
import style from "./style.module.scss";

export const Dropdown = ({
  showDropdown,
  handleClick,
}: {
  added: boolean;
  blocked: boolean;
  showDropdown: boolean;
  handleClick: (data: string) => void;
}) => {
  const history = useHistory();
  return (
    <>
      {showDropdown && (
        <div className={style.dropdown}>
          <div onClick={() => history.push("/group-chat/review-details")}>
            Group Info
          </div>
          <div onClick={() => handleClick("leaveGroup")}>Leave Group</div>
          <div onClick={() => handleClick("deleteGroup")}>Delete Group</div>
        </div>
      )}
    </>
  );
};
