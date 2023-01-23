import { CommonPopupOptions } from "@chatTypes";
import { leaveGroup } from "@graphQL/groups-api";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { AlertPopup } from "./alert-popup";
import { BlockUserPopup } from "./block-user-popup";
import { DeleteChatPopup } from "./delete-chat-popup";
import { DeleteGroupPopup } from "./delete-group-popup";
import { UnblockUserPopup } from "./unblock-user-popup";

export const ChatActionsPopup = ({
  action,
  setConfirmAction,
}: {
  action: string;
  setConfirmAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [processing, setProcessing] = useState(false);
  const history = useHistory();
  /// Target address for one to one chat
  const targetAddress = history.location.pathname.split("/")[2];

  const handleLeaveGroup = async () => {
    setProcessing(true);
    const groupId = history.location.pathname.split("/")[3];
    leaveGroup(groupId);
    setConfirmAction(false);
  };

  return (
    <>
      {action === "block" && (
        <BlockUserPopup setConfirmAction={setConfirmAction} />
      )}
      {action === "unblock" && (
        <UnblockUserPopup
          setConfirmAction={setConfirmAction}
          userName={targetAddress}
        />
      )}
      {action === "delete" && (
        <DeleteChatPopup setConfirmAction={setConfirmAction} />
      )}
      {action === "deleteGroup" && (
        <DeleteGroupPopup setConfirmAction={setConfirmAction} />
      )}
      {action === "leaveGroup" && (
        <AlertPopup
          setConfirmAction={setConfirmAction}
          heading={"Leave Group Chat?"}
          description={
            "You won’t receive further messages from this group. \n\nThe group will be notified that you have left."
          }
          firstButtonTitle="Cancel"
          secondButtonTitle="Leave"
          processing={processing}
          onClick={(action: CommonPopupOptions) => {
            if (action === CommonPopupOptions.ok) {
              handleLeaveGroup();
            } else {
              setConfirmAction(false);
            }
          }}
        />
      )}
    </>
  );
};
