import classnames from "classnames";
import React, { FunctionComponent, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { SwitchUser } from "@components/switch-user";
import { HeaderLayout } from "@layouts/index";
import { IBCTransferView } from "../main/ibc-transfer";
import { Menu } from "../main/menu";
import style from "./style.module.scss";
import { ShowNotification } from "@components/show-notification";

export const MorePage: FunctionComponent = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={true}
      menuRenderer={<Menu />}
      rightRenderer={<SwitchUser />}
      notificationRenderer={
        <ShowNotification
          setShowNotifications={setShowNotifications}
          showNotifications={showNotifications}
        />
      }
      setShowNotifications={setShowNotifications}
      showNotifications={showNotifications}
    >
      <Card className={classnames(style.card, "shadow")}>
        <CardBody>
          <IBCTransferView />
        </CardBody>
      </Card>
    </HeaderLayout>
  );
};
