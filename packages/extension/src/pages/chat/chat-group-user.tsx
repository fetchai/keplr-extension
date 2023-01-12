import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import rightArrowIcon from "@assets/icon/right-arrow.png";
import style from "./style.module.scss";
import amplitude from "amplitude-js";
import { Group, GroupMessagePayload } from "@chatTypes";
import { decryptGroupMessage } from "../../utils/decrypt-group";

export const ChatGroupUser: React.FC<{
  chainId: string;
  group: Group;
}> = ({ chainId, group }) => {
  const [message, setMessage] = useState<GroupMessagePayload>();
  const history = useHistory();

  const handleClick = () => {
    amplitude.getInstance().logEvent("Open Group click", {
      from: "Chat history",
    });
    history.push(`/group-chat/chat-section/${group.id}`);
  };

  useEffect(() => {
    if (group) {
      setMessage(decryptGroupMessage(group.lastMessageContents));
    }
  }, [chainId, group]);

  return (
    <div
      className={style.group}
      style={{ position: "relative" }}
      onClick={handleClick}
    >
      {/* {Number(sender?.lastSeenTimestamp) <
        Number(receiver?.lastSeenTimestamp) &&
        group.lastMessageSender === targetAddress &&
        Number(group.lastMessageTimestamp) >
          Number(sender?.lastSeenTimestamp) && (
          <span
            style={{
              height: "12px",
              width: "12px",
              backgroundColor: "#d027e5",
              borderRadius: "20px",
              bottom: "20px",
              left: "6px",
              position: "absolute",
              zIndex: 1,
            }}
          />
        )} */}
      <div className={style.initials}>
        <img
          className={style.groupImage}
          src={require("@assets/group710.svg")}
        />
      </div>
      <div className={style.messageInner}>
        <div className={style.name}>{group.name}</div>
        <div className={style.messageText}>{message?.message ?? ""}</div>
      </div>
      <div>
        <img src={rightArrowIcon} style={{ width: "80%" }} alt="message" />
      </div>
    </div>
  );
};
