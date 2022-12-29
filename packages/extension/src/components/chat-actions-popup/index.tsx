import React from "react";
import { useHistory } from "react-router";
import { BlockUserPopup } from "./block-user-popup";
import { DeleteChatPopup } from "./delete-chat-popup";
import { UnblockUserPopup } from "./unblock-user-popup";

export const ChatActionsPopup = ({
  action,
  setConfirmAction,
}: {
  action: string;
  setConfirmAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];

  return (
    <>
      {action === "block" && (
        <BlockUserPopup setConfirmAction={setConfirmAction} />
      )}
      {action === "unblock" && (
        <UnblockUserPopup
          setConfirmAction={setConfirmAction}
          userName={userName}
        />
      )}
      {action === "delete" && (
        <DeleteChatPopup setConfirmAction={setConfirmAction} />
      )}
    </>
  );
};
