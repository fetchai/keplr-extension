import React from "react";
import { DeleteChatPopup } from "./delete-chat-popup";

export const ActionsPopup = ({
  action,
  setConfirmAction,
}: {
  action: string;
  setConfirmAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {action === "leaveGroup" && (
        <DeleteChatPopup setConfirmAction={setConfirmAction} />
      )}
      {action === "deleteGroup" && (
        <DeleteChatPopup setConfirmAction={setConfirmAction} />
      )}
    </>
  );
};
