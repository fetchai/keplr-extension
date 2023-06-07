import React, { FunctionComponent } from "react";
import { HeaderLayout } from "@layouts/index";
import { useHistory } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import "./style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import stakeIcon from "@assets/icon/stake-grey.png";
import contractIcon from "@assets/icon/contract-grey.png";
import claimIcon from "@assets/icon/claim-grey.png";
import awaiting from "@assets/icon/awaiting.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import activities from "./activities";

export const ActivityPage: FunctionComponent = observer(() => {
  const history = useHistory();
  const intl = useIntl();

  const getImageSource = (type: string): string => {
    switch (type) {
      case "send":
        return sendIcon;
      case "stake":
        return stakeIcon;
      case "contract":
        return contractIcon;
      case "claim":
        return claimIcon;
      default:
        return "";
    }
  };

  const getStatusImageSource = (status: string): string => {
    switch (status) {
      case "awaiting":
        return awaiting;
      case "success":
        return success;
      case "cancel":
        return cancel;
      default:
        return "";
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "main.menu.settings",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div
        className="activity-label"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <FormattedMessage id="main.menu.activity" />{" "}
        <a href="#">All activity</a>
      </div>
      <div className="activity-table">
        {activities.map((activity, index) => (
          <Row key={index} className="activity-row">
            <Col className="activity-column">
              <img src={getImageSource(activity.type)} alt={activity.type} />
              {activity.address}
            </Col>
            <Col className="activity-column">{`${activity.amount}${activity.denom}`}</Col>
            <Col className="activity-column">
              <img
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
