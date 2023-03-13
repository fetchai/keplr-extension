import { NotyphiNotification } from "@notificationTypes";
import React, { FunctionComponent, useState } from "react";
import style from "./style.module.scss";

interface Props {
  elem: NotyphiNotification;
  onCrossClick: (deliveryId: string) => void;
  onFlagClick: (deliveryId: string, flag: boolean) => void;
}
export const NotificationItem: FunctionComponent<Props> = ({
  elem,
  onCrossClick,
  onFlagClick,
}) => {
  const [flag, setFlag] = useState(false);
  const { delivery_id } = elem;

  const handleFlag = () => {
    if (!flag) {
      setFlag(true);
      onFlagClick(delivery_id, flag);
      const elem = document.getElementById(delivery_id);
      /// Todo handle in different way
      if (elem) {
        elem.classList.remove(style.flag);
        elem.classList.add(style.disabled);
      }
    }
  };

  const handleRead = () => {
    onCrossClick(delivery_id);
  };

  return (
    <>
      <div className={style.notification}>
        <div className={style.notificationHead}>
          <img src={require("@assets/svg/fetchai-icon.svg")} />
          <p className={style.headName}>{elem.title}</p>
          <div className={style.notificationIcons}>
            <img
              src={require("@assets/svg/flag-icon.svg")}
              id={delivery_id}
              className={style.flag}
              onClick={handleFlag}
            />
            <img
              src={require("@assets/svg/cross-icon.svg")}
              className={style.cross}
              onClick={handleRead}
            />
          </div>
        </div>

        <div className={style.notificationMsg}>
          <p>{elem.content}</p>
        </div>

        <div className={style.notificationTime}>
          <p>1 min ago</p>
        </div>
      </div>
      {flag && (
        <div className={style.flagged}>
          <p className={style.flaggedText}>
            Thanks for flagging this. We&apos;ll take a look at it
          </p>
        </div>
      )}
    </>
  );
};
