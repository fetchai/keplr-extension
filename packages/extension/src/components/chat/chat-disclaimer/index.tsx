import privacyIcon from "@assets/hello.png";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import closeIcon from "@assets/icon/close-grey.png";

export const ChatDisclaimer = () => {
  const { chainStore, accountStore } = useStore();
  const walletAddress = accountStore.getAccount(chainStore.current.chainId)
    .bech32Address;
  const [openDialog, setIsOpendialog] = useState(false);

  useEffect(() => {
    const addresses = localStorage.getItem("fetchChatAnnouncementSeen") || "";
    if (walletAddress) setIsOpendialog(!addresses.includes(walletAddress));
  }, [walletAddress]);

  const history = useHistory();
  const handleClick = async (redirectFlag: boolean) => {
    const addresses = localStorage.getItem("fetchChatAnnouncementSeen") || "";
    localStorage.setItem(
      "fetchChatAnnouncementSeen",
      addresses + `[${walletAddress}]`
    );
    setIsOpendialog(false);
    if (redirectFlag) history.push("/chat");
  };

  return openDialog ? (
    <>
      <div className={style.overlay} onClick={() => handleClick(false)} />
      <div className={style.popupContainer}>
        <img
          draggable={false}
          src={closeIcon}
          style={{
            width: "12px",
            height: "12px",
            cursor: "pointer",
            position: "absolute",
            float: "right",
            right: "14px",
            top: "14px",
          }}
          aria-hidden="true"
          onClick={() => handleClick(false)}
        />

        <img draggable={false} src={privacyIcon} />
        <br />
        <div className={style.infoContainer}>
          <h3>Chat is now free for a limited time!</h3>
          <p>
            Previously you would need some FET balance to be able to use this
            feature but we have made it free specially for you to play around.
          </p>
        </div>
        <button type="button" onClick={() => handleClick(true)}>
          Got To Chat
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};
