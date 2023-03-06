import React, { FunctionComponent, useState } from "react";
import style from "../notification-modal/style.module.scss";

interface Props {
  elem: any;
}
export const NotificationItem: FunctionComponent<Props> = ({ elem }) => {
  const [flag, setFlag] = useState(false);

  const handleFlag = () => {
    setFlag(!flag);
  };
  return (
    <div className={style.notification}>
      <div className={style.notificationHead}>
        <img src={require("@assets/svg/" + elem.icon)} />
        <p className={style.headName}>{elem.name}</p>
        <div className={style.notificationIcons}>
          <img
            src={require("@assets/svg/flag-icon.svg")}
            onClick={handleFlag}
          />
          <img src={require("@assets/svg/cross-icon.svg")} />
        </div>
      </div>

      <div className={style.notificationMsg}>
        <p>{elem.message}</p>
      </div>

      <div className={style.notificationTime}>
        <p>1 min ago</p>
      </div>

      {flag && (
        <div className={style.flagged}>
          <p className={style.flaggedText}>
            Thanks for flagging this. We&apos;ll take a look at it
          </p>
        </div>
      )}

      <p>
        Powered by
        <img src={require("@assets/svg/notiphy-icon.svg")} />
      </p>
    </div>
  );
};
