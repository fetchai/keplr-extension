import { notificationsDetails } from "@chatStore/user-slice";
import { HeaderLayout } from "@layouts/header-layout";
import { NotificationSetup, NotyphiOrganisation } from "@notificationTypes";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useHistory } from "react-router";
import { Button } from "reactstrap";
import style from "./style.module.scss";
export const ReviewNotification: FunctionComponent = () => {
  const history = useHistory();

  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);
  const [organisations, setOriganisations] = useState("");

  useEffect(() => {
    const data = Object.values(notificationInfo.organisations)
      .map((item: NotyphiOrganisation) => item.name)
      .join(", ");

    setOriganisations(data);
  }, [notificationInfo.organisations]);

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
      <div className={style.reviewContainer}>
        <p className={style.reviewHeading}>
          You just set up your Notifications!
        </p>
        <div className={style.greyCircle} />

        <p className={style.reviewChoice}>Organisations</p>
        <p className={style.reviewOptions}>
          <span>{organisations}</span>
        </p>
        <p className={style.reviewChoice} style={{ display: "none" }}>
          Topics
        </p>
        <p className={style.reviewOptions} style={{ display: "none" }}>
          Defi, Defi, SomethingElse, Defi, Defi, Defi
        </p>
        <p className={style.reviewNote}>
          These can be changed at any time from the settings menu.
        </p>

        <div className={style.reviewButtonContainer}>
          <Button
            className={style.button + " " + style.invertedButton}
            onClick={() => history.push("/setting/notifications")}
          >
            Settings
          </Button>
          <Button
            className={style.button}
            color="primary"
            onClick={() => history.go(-2)}
          >
            Back Home
          </Button>
        </div>
      </div>
    </HeaderLayout>
  );
};
