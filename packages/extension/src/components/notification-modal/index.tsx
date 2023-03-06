import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import { Button } from "reactstrap";
import { NotificationItem } from "@components/notification-Item/index";
import { PoweredByNote } from "./powered-by-note/powered-by-note";
import { fetchFollowedOrganisations } from "@utils/fetch-notification";
import { useStore } from "../../stores";
import { NotyphiOrganisation } from "@notificationTypes";
interface NotificationPayload {
  modalType: NotificationModalType;
  notificationList?: any[];
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

  useEffect(() => {
    fetchFollowedOrganisations(accountInfo.bech32Address).then(
      (followOrganisationList: NotyphiOrganisation[]) => {
        setIsLoading(false);
        if (followOrganisationList.length == 0) {
          setNotificationPayload({
            modalType: NotificationModalType.initial,
            heading: "We've just added Notifications!",
            paragraph:
              "Now you can get the latest news from your favourite organisations.",
            buttonLabel: "Get started",
            headingColor: "#3b82f6",
          });
        } else {
          /// Todo call fetch notification api
          setNotificationPayload({
            modalType: NotificationModalType.empty,
            heading: "No new notifications.",
            paragraph: "Add more topics or organisations in Settings",
            showSetting: true,
          });
        }
      }
    );
  }, [accountInfo.bech32Address]);

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
            <p className={style.deleteIcon}>
              <img src={require("@assets/svg/delete-icon.svg")} />
              <p className={style.clearAll}>Clear all</p>
            </p>
            <p className={style.settings} onClick={navigateToSettingsHandler}>
              Settings
            </p>
          </div>

          {notificationPayload.notificationList.map((elem) => (
            <NotificationItem key={elem.id} elem={elem} />
          ))}
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
    <div className={style.notificationModal}>{decideNotificationView()}</div>
  );
};
