import amplitude from "amplitude-js";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import style from "./style.module.scss";

export const ChatActionsDropdown = ({
  added,
  blocked,
  showDropdown,
  handleClick,
}: {
  added: boolean;
  blocked: boolean;
  showDropdown: boolean;
  handleClick: (data: string) => void;
}) => {
  return (
    <React.Fragment>
      {showDropdown && (
        <div className={style["dropdown"]}>
          {added ? <ViewContactOption /> : <AddContactOption />}
          {blocked ? (
            <UnblockOption handleClick={handleClick} />
          ) : (
            <BlockOption handleClick={handleClick} />
          )}
          {/* <div onClick={() => handleClick("delete")}>Delete chat</div> */}
        </div>
      )}
    </React.Fragment>
  );
};

const ViewContactOption = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        amplitude.getInstance().logEvent("Address book viewed", {});
        navigate("/setting/address-book");
      }}
    >
      View in address book
    </div>
  );
};

const AddContactOption = () => {
  const navigate = useNavigate();
  const userName = useLocation().pathname.split("/")[2];
  return (
    <div
      onClick={() => {
        amplitude.getInstance().logEvent("Add to address click", {});
        navigate("/setting/address-book", {
          state: {
            openModal: true,
            addressInputValue: userName,
          },
        });
      }}
    >
      Add to address book
    </div>
  );
};

const BlockOption = ({
  handleClick,
}: {
  handleClick: (data: string) => void;
}) => {
  return (
    <div
      onClick={() => {
        amplitude.getInstance().logEvent("Block click", {});
        handleClick("block");
      }}
    >
      Block contact
    </div>
  );
};

const UnblockOption = ({
  handleClick,
}: {
  handleClick: (data: string) => void;
}) => {
  return (
    <div
      onClick={() => {
        amplitude.getInstance().logEvent("Unblock click", {});
        handleClick("unblock");
      }}
    >
      Unblock contact
    </div>
  );
};
