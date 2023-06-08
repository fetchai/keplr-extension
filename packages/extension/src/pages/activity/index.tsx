import React, { FunctionComponent } from "react";
import { HeaderLayout } from "@layouts/index";
import { useHistory } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import style from "./style.module.scss";

import activities from "./activities";
import { formatAddress, formatTokenName } from "@utils/format";
import {getAmountClass,getStatusImageSource,getImageSource } from "@utils/activity-utils";

export const ActivityPage: FunctionComponent = observer(() => {
  const history = useHistory();
  const intl = useIntl();
  

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "main.menu.activity",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.container}>
        <FormattedMessage id="main.menu.activity" />{" "}
        <a href="#">All activity</a>
      </div>
      <div>
        {activities.map((activity, index) => (
          <Row className={style.activityRow} key={index}>
            <Col className={style.activityCol}>
              <img src={getImageSource(activity.type)} alt={activity.type} />
              <span>
                {activity.type === "contract"
                  ? formatTokenName(activity.hash)
                  : formatAddress(activity.address)}
              </span>
            </Col>
            <Col className={style.activityCol}>
              {activity.type !== "contract" ? (
                <>
                  <span className={getAmountClass(activity.amount)}>
                    {activity.amount.charAt(0)}
                  </span>
                  {activity.amount.substring(1)}
                  {activity.denom}
                </>
              ) : (
                formatTokenName(activity.address)
              )}
            </Col>
            <Col className={style.activityStatus}>
              <img
                style={{ alignItems: "center" }}
                src={getStatusImageSource(activity.status)}
                alt={activity.status}
              />
            </Col>
          </Row>
        ))}
      </div>
    </HeaderLayout>
  );
});

export default ActivityPage;
