/* eslint-disable react-hooks/exhaustive-deps */
import chevronLeft from "@assets/icon/chevron-left.png";
import { useNotification } from "@components/notification";
import { ToolTip } from "@components/tooltip";
import { formatAddress } from "@utils/format";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import style from "./style.module.scss";

export const UserNameSection = () => {
  const history = useHistory();
  const notification = useNotification();
  const intl = useIntl();

  const userName = history.location.pathname.split("/")[2];

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    notification.push({
      placement: "top-center",
      type: "success",
      duration: 2,
      content: intl.formatMessage({
        id: "main.address.copied",
      }),
      canDelete: true,
      transition: {
        duration: 0.25,
      },
    });
  };

  return (
    <div className={style.username}>
      <div className={style.leftBox}>
        <img
          alt=""
          draggable="false"
          className={style.backBtn}
          src={chevronLeft}
          onClick={() => {
            history.goBack();
          }}
        />
        <span className={style.recieverName}>
          <ToolTip
            tooltip={
              <div className={style.user} style={{ minWidth: "300px" }}>
                {userName}
              </div>
            }
            theme="dark"
            trigger="hover"
            options={{
              placement: "top",
            }}
          >
            {formatAddress(userName)}
          </ToolTip>
        </span>
        <span className={style.copyIcon} onClick={() => copyAddress(userName)}>
          <i className="fas fa-copy" />
        </span>
      </div>
      <div className={style.rightBox} />
    </div>
  );
};
