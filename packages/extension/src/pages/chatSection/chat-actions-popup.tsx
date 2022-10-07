import React, { useState } from "react";
import { useHistory } from "react-router";
import style from "./style.module.scss";

const popupData = {
  block: {
    heading: "Block ",
    text1: "This contact will not be able to send you messages.",
    text2: "The contact will not be notified.",
    check: "Also report contact",
    text3: "The last 5 messages will be sent to Fetch.",
    button: "Block",
  },
  delete: {
    heading: "Delete ",
    text1:
      "You will lose all your messages in this chat. This action cannot be undone",
    button: "Delete",
  },
};

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
  const [actionData, setActionData] = useState(false);

  const handleClick = (data: any) => {
    setActionData(data);
    setConfirmAction(true);
    setShowDropdown(false);
  };
  const history = useHistory();
  return (
    <>
      {confirmAction && (
        <ChatActionsPopup
          actionData={actionData}
          setConfirmAction={setConfirmAction}
        />
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
            <div>Unblock contact</div>
          ) : (
            <div onClick={() => handleClick(popupData.block)}>
              Block contact
            </div>
          )}
          {/* <div>Report as spam</div> */}
          <div onClick={() => handleClick(popupData.delete)}>Delete chat</div>
        </div>
      )}
    </>
  );
};

export const ChatActionsPopup = ({
  actionData,
  setConfirmAction,
}: {
  actionData: any;
  setConfirmAction: Function;
}) => {
  const { heading, button, text1, text2, text3, check } = actionData;
  const handleClick = () => {
    setConfirmAction(false);
  };

  return (
    <div className={style.popup}>
      <h4>{heading} ?</h4>
      <section>
        <p className={style.textContainer}>{text1}</p>
        <p className={style.textContainer}>{text2}</p>
        {check && (
          <div className={style.textContainer}>
            <input type="checkbox" id="check" />
            <label htmlFor="check">{check}</label>
          </div>
        )}
        <p className={style.textContainer}>{text3}</p>
      </section>
      <div className={style.buttonContainer}>
        <button type="button" onClick={handleClick}>
          Cancel
        </button>
        <button type="button" className={style.btn} onClick={handleClick}>
          {button}
        </button>
      </div>
    </div>
  );
};
