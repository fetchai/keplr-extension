import React, { useState } from "react";
import { useHistory } from "react-router";
import { BlockUserPopup } from "./block-user-popup";
import { DeleteChatPopup } from "./delete-chat-popup";
import style from "./style.module.scss";
import { UnblockUserPopup } from "./unblock-user-popup";

export const Dropdown = ({
  added,
  blocked,
  showDropdown,
  setShowDropdown,
}: {
  added: boolean;
  blocked: boolean;
  showDropdown: boolean;
  setShowDropdown: Function;
}) => {
  const [confirmAction, setConfirmAction] = useState(false);
  const [action, setAction] = useState("");

  const handleClick = (data: string) => {
    setAction(data);
    setConfirmAction(true);
    setShowDropdown(false);
  };
  const history = useHistory();
  return (
    <>
      {confirmAction && (
        <>
          {action === "block" && (
            <BlockUserPopup setConfirmAction={setConfirmAction} />
          )}
          {action === "unblock" && (
            <UnblockUserPopup setConfirmAction={setConfirmAction} />
          )}
          {action === "delete" && (
            <DeleteChatPopup setConfirmAction={setConfirmAction} />
          )}
        </>
      )}
      {showDropdown && (
        <div className={style.dropdown}>
          {added ? (
            <div onClick={() => history.push("/setting/address-book")}>
              View in address book
            </div>
          ) : (
            <div>Add to address book</div>
          )}
          {blocked ? (
            <div onClick={() => handleClick("unblock")}>Unblock contact</div>
          ) : (
            <div onClick={() => handleClick("block")}>Block contact</div>
          )}
          {/* <div>Report as spam</div> */}
          <div onClick={() => handleClick("delete")}>Delete chat</div>
        </div>
      )}
    </>
  );
};
