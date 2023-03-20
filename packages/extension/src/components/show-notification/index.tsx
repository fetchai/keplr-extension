import { store } from "@chatStore/index";
import {
  notificationsDetails,
  setNotifications,
  WalletConfig,
  walletConfig,
} from "@chatStore/user-slice";
import { NotificationSetup } from "@notificationTypes";
import React, { useEffect } from "react";
import style from "./style.module.scss";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useStore } from "../../stores";

interface Props {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  showNotifications: boolean;
}

export const ShowNotification: FunctionComponent<Props> = (props) => {
  const { accountStore, chainStore } = useStore();
  const current = chainStore.current;

  const accountInfo = accountStore.getAccount(current.chainId);
  const config: WalletConfig = useSelector(walletConfig);
  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);

  useEffect(() => {
    const notificationFlag =
      localStorage.getItem(`turnNotifications-${accountInfo.bech32Address}`) ||
      "true";
    const localNotifications = JSON.parse(
      localStorage.getItem(`notifications-${accountInfo.bech32Address}`) ||
        JSON.stringify([])
    );
    /// Updating the notification status in redux
    store.dispatch(
      setNotifications({
        unreadNotification: localNotifications.length > 0,
        isNotificationOn: notificationFlag == "true",
      })
    );
  }, [accountInfo.bech32Address]);

  return config.notiphyWhitelist &&
    (config.notiphyWhitelist === null ||
      config.notiphyWhitelist.length === 0 ||
      config.notiphyWhitelist.indexOf(accountInfo.bech32Address) !== -1) ? (
    <div className={style.main}>
      <div
        className={style.imgDiv}
        onClick={(e) => {
          e.preventDefault();

          props.setShowNotifications(!props.showNotifications);
        }}
      >
        {notificationInfo.isNotificationOn ? (
          <div>
            {notificationInfo.unreadNotification && (
              <span className={style.bellDot} />
            )}
            <i className="fa fa-bell" />
          </div>
        ) : (
          <i className="fa fa-bell-slash" />
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};
