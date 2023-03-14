import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import { Button } from "reactstrap";
import { NotificationItem } from "@components/notification-Item/index";
import { PoweredByNote } from "./powered-by-note/powered-by-note";
import {
  fetchAllNotifications,
  fetchFollowedOrganisations,
  markDeliveryAsRead,
  markDeliveryAsRejected,
} from "@utils/fetch-notification";
import { useStore } from "../../stores";
import {
  NotyphiNotification,
  NotyphiNotifications,
  NotyphiOrganisation,
} from "@notificationTypes";
import { store } from "@chatStore/index";
import { setNotifications } from "@chatStore/user-slice";
interface NotificationPayload {
  modalType: NotificationModalType;
  notificationList?: NotyphiNotification[];
  heading: string;
  paragraph?: string;
  showSetting?: boolean;
  buttonLabel?: string;
  headingColor?: string;
}

export enum NotificationModalType {
  initial,
  empty,
  notificationOff,
  notifications,
}

export const NotificationModal = () => {
  const history = useHistory();

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const [isLoading, setIsLoading] = useState(true);
  const [
    notificationPayload,
    setNotificationPayload,
  ] = useState<NotificationPayload>();

  const navigateToSettingsHandler = () => {
    history.push("/setting/notifications");
  };

  const handleClick = () => {
    if (notificationPayload?.modalType === NotificationModalType.initial) {
      history.push("notification/organizations/add");
    }
  };

  const setNotificationPayloadHelper = (
    notifications: NotyphiNotification[]
  ) => {
    if (notifications.length === 0) {
      setNotificationPayload({
        modalType: NotificationModalType.empty,
        heading: "No new notifications.",
        paragraph: "Add more topics or organisations in Settings",
        showSetting: true,
      });
    } else {
      setNotificationPayload({
        modalType: NotificationModalType.notifications,
        notificationList: Object.values(notifications),
        heading: "",
      });
    }
  };

  const fetchNotifications = async () => {
    const notificationData = await fetchAllNotifications(
      accountInfo.bech32Address
    ).finally(() => setIsLoading(false));

    const notifications: NotyphiNotifications = {};

    /// fetch notification from local db
    const localNotifications: NotyphiNotification[] = JSON.parse(
      localStorage.getItem(`notifications-${accountInfo.bech32Address}`) ??
        JSON.stringify([])
    );

    /// Combining the server and local notifications data
    notificationData.map((element: NotyphiNotification) => {
      notifications[element.delivery_id] = element;
    });
    localNotifications.map((element) => {
      notifications[element.delivery_id] = element;
    });

    localStorage.setItem(
      `notifications-${accountInfo.bech32Address}`,
      JSON.stringify(Object.values(notifications))
    );

    setNotificationPayloadHelper(Object.values(notifications));
  };

  useEffect(() => {
    fetchFollowedOrganisations(accountInfo.bech32Address).then(
      (followOrganisationList: NotyphiOrganisation[]) => {
        store.dispatch(
          setNotifications({
            organisations: followOrganisationList,
          })
        );

        if (followOrganisationList.length === 0) {
          setIsLoading(false);
          setNotificationPayload({
            modalType: NotificationModalType.initial,
            heading: "We've just added Notificatsions!",
            paragraph:
              "Now you can get the latest news from your favourite organisations.",
            buttonLabel: "Get started",
            headingColor: "#3b82f6",
          });
        } else {
          fetchNotifications();
        }
      }
    );
  }, [accountInfo.bech32Address]);

  const onCrossClick = (deliveryId: string) => {
    markDeliveryAsRead(deliveryId, accountInfo.bech32Address).finally(() => {
      if (notificationPayload?.notificationList) {
        const unreadNotifications = notificationPayload?.notificationList.filter(
          (notification: NotyphiNotification) =>
            notification.delivery_id !== deliveryId
        );

        setNotificationPayloadHelper(unreadNotifications);
        localStorage.setItem(
          `notifications-${accountInfo.bech32Address}`,
          JSON.stringify(unreadNotifications)
        );
      }
    });
  };

  const onFlagClick = (deliveryId: string) => {
    markDeliveryAsRejected(deliveryId, accountInfo.bech32Address).finally(
      () => {
        /// Getting updated info everytime as flag UI take 2 sec delay to update
        const localNotifications = JSON.parse(
          localStorage.getItem(`notifications-${accountInfo.bech32Address}`) ||
            JSON.stringify([])
        );

        const newLocalNotifications = localNotifications.filter(
          (notification: NotyphiNotification) =>
            notification.delivery_id !== deliveryId
        );
        localStorage.setItem(
          `notifications-${accountInfo.bech32Address}`,
          JSON.stringify(newLocalNotifications)
        );

        /// Removing flag notification from list after 2 sec
        setTimeout(() => {
          setNotificationPayloadHelper(newLocalNotifications);
        }, 2000);
      }
    );
  };

  const handleClearAll = () => {
    /// Clearing local db notifications data
    localStorage.removeItem(`notifications-${accountInfo.bech32Address}`);

    setNotificationPayloadHelper([]);
  };

  function decideNotificationView(): React.ReactNode {
    if (isLoading) {
      return (
        <div className={style.isLoading}>
          <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
        </div>
      );
    }

    if (notificationPayload && notificationPayload.notificationList) {
      return (
        <>
          <div className={style.heading}>
            <div className={style.deleteIcon} onClick={handleClearAll}>
              <img
                src={require("@assets/svg/delete-icon.svg")}
                draggable={false}
              />
              <p className={style.clearAll}>Clear all</p>
            </div>
            <p className={style.settings} onClick={navigateToSettingsHandler}>
              Settings
            </p>
          </div>

          {notificationPayload.notificationList.map((elem) => (
            <NotificationItem
              key={elem.delivery_id}
              elem={elem}
              onCrossClick={onCrossClick}
              onFlagClick={onFlagClick}
            />
          ))}
          <PoweredByNote />
        </>
      );
    }

    if (notificationPayload) {
      return (
        <>
          {notificationPayload.showSetting && (
            <p className={style.settings} onClick={navigateToSettingsHandler}>
              Settings
            </p>
          )}

          <div className={style.notifyContainer}>
            <div className={style.greyCircle} />
            <p
              className={style.notifyHeading}
              style={{ color: notificationPayload.headingColor }}
            >
              {notificationPayload.heading}
            </p>
            {notificationPayload.paragraph && (
              <p className={style.notifyDescription}>
                {notificationPayload.paragraph}
              </p>
            )}
            {notificationPayload.buttonLabel && (
              <Button
                className={style.notifyButton}
                color="primary"
                onClick={handleClick}
              >
                {notificationPayload.buttonLabel}
              </Button>
            )}

            <PoweredByNote />
          </div>
        </>
      );
    }

    return <></>;
  }

  return (
    <div className={style.notificationModal}>
      <div className={style.scrollView}>{decideNotificationView()}</div>
    </div>
  );
};
