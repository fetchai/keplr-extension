import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent, useMemo } from "react";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import { NotificationOption } from "../../../components/notification-option/notification-option";
import { PageButton } from "../page-button";
import { notificationsDetails } from "@chatStore/user-slice";
import { NotificationSetup } from "@notificationTypes";
import { useSelector } from "react-redux";

export const SettingNotifications: FunctionComponent = () => {
  const history = useHistory();
  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Notifications"}
      showBottomMenu={false}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.notificationSettingContainer}>
        <div className={style.notificationOptionMainContainer}>
          <NotificationOption name="Receive notifications" />
        </div>

        <PageButton
          title="Organisations"
          paragraph={`Following ${
            Object.values(notificationInfo.organisations).length
          } organisation`}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
          onClick={() => {
            history.push("/notification/organizations/edit");
          }}
        />

        <PageButton
          title="Topics"
          paragraph="None followed "
          style={{ display: "none" }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
          onClick={() => {
            history.push({
              pathname: "/notification/topics/edit",
              state: {
                isUpdating: true,
              },
            });
          }}
        />
      </div>
    </HeaderLayout>
  );
};
