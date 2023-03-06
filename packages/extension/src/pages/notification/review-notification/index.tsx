import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent } from "react";

import { useHistory } from "react-router";
import { Button } from "reactstrap";
import style from "./style.module.scss";
export const ReviewNotification: FunctionComponent = () => {
  const history = useHistory();

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
          {/* {state.added.map((item: any) => (
            <span>{`${item},`}</span>
          ))} */}
        </p>
        <p className={style.reviewChoice}>Topics</p>
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
