import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { HeaderLayout } from "@layouts/index";
import { useHistory } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { Col, Container, Row } from "reactstrap";
import style from "./style.module.scss";

import activities from "./activities";
import { formatAddress, formatTokenName } from "@utils/format";
import {
  getAmountClass,
  getStatusImageSource,
  getImageSource,
} from "@utils/activity-utils";

export const ActivityPage: FunctionComponent = observer(() => {
  const history = useHistory();
  const intl = useIntl();
  const [activityList, setActivityList] = useState<
    {
      type: string;
      hash: string;
      amount: string;
      denom: string;
      address: string;
      status: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchActivities();

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const fetchActivities = () => {
    setIsLoading(true);
    setTimeout(() => {
      const initialActivityList = activities.slice(0, 12);
      setActivityList(initialActivityList);
      setIsLoading(false);
    }, 1000);
  };
  const remainingActivities = activities.length - activityList.length;
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

      if (
        remainingActivities > 0 &&
        scrollTop + clientHeight >= scrollHeight - 10 &&
        !isLoading
      ) {
        setIsLoading(true);
        setTimeout(() => {
          const currentLength = activityList.length;
          const nextActivityList = activities.slice(
            currentLength - 10,
            currentLength + 10
          );
          setActivityList((prevActivityList) => [
            ...prevActivityList,
            ...nextActivityList,
          ]);
          setIsLoading(false);
        }, 1000);
      } else if (remainingActivities === 0) {
        setIsLoading(false);
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    }
  };

  console.log(activityList);
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
      <div
        className={style.activityList}
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: "400px", width: "100%", overflow: "auto" }}
      >
        {activityList.map((activity, index) => (
          <Container>
            <Row className={style.activityRow} key={index}>
              <Col xs={3} className={style.activityCol}>
                <img src={getImageSource(activity.type)} alt={activity.type} />
                <span>
                  {" " + activity.type === "contract"
                    ? formatTokenName(activity.hash)
                    : formatAddress(activity.address)}
                </span>
              </Col>
              <Col xs={3} className={style.activityCol}>
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
              <Col xs={1}>
                <img
                  
                  src={getStatusImageSource(activity.status)}
                  alt={activity.status}
                />
              </Col>
            </Row>
          </Container>
        ))}
        {remainingActivities !== 0 ? isLoading  && (
          <span>Loading more activities...</span>
        ): <span>done!</span>}
      </div>
    </HeaderLayout>
  );
});

export default ActivityPage;
