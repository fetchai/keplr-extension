import { notificationsDetails } from "@chatStore/user-slice";
import { HeaderLayout } from "@layouts/header-layout";
import {
  NotificationSetup,
  NotyphiOrganisation,
  NotyphiTopic,
} from "@notificationTypes";

import { useStore } from "../../../stores";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useHistory } from "react-router";
import { Button } from "reactstrap";
import style from "./style.module.scss";
export const ReviewNotification: FunctionComponent = () => {
  const history = useHistory();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);
  const [organisations, setOriganisations] = useState("");
  const topics: NotyphiTopic[] = JSON.parse(
    localStorage.getItem(`topics-${accountInfo.bech32Address}`) ||
      JSON.stringify([])
  );

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
        <div className={style.greyCircle}>
          <img src={require("@assets/svg/initial-bell-icon.svg")} />
        </div>

        <p className={style.reviewChoice}>Organisations</p>
        <p className={style.reviewOptions}>
          <span>{organisations}</span>
        </p>
        {Object.values(topics).length > 0 && (
          <p className={style.reviewChoice}>Topics</p>
        )}
        <p className={style.reviewOptions}>
          {topics.map((item: NotyphiTopic) => item.name).join(", ")}
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
            onClick={() => history.go(-3)}
          >
            Back Home
          </Button>
        </div>
      </div>
    </HeaderLayout>
  );
};
