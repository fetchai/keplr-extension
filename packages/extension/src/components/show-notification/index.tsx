import { store } from "@chatStore/index";
import { notificationsDetails, setNotifications } from "@chatStore/user-slice";
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
  const whiteListedUsers: string[] = [
    "fetch1z8sx9qcpm7xq220g6e4rvvk3vh5el0wz9thqry",
    "fetch1sh7quxpfdq6j66pwftn8axh66nlw0g6j53a9js",
    "fetch1fhwymg4adeupm4gn2yft32hm63whwyfqdc5trw",
    "fetch1n8d2c36j568fvkwy6n3a6lewv43d3h4qgg073p",
    "fetch13sqgusw5z7h92g4ynctselm56566ksukh93mda",
    "fetch1kn6uqpreqh7h6fe2qh6lda3kkgm0vlev2tu3gu",
    "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
  ];

  const { accountStore, chainStore } = useStore();
  const current = chainStore.current;

  const accountInfo = accountStore.getAccount(current.chainId);
  const showIcon = whiteListedUsers.indexOf(accountInfo.bech32Address) !== -1;
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

  return showIcon ? (
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
