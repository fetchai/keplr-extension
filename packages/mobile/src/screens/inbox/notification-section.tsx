import React, { FunctionComponent } from "react";
import { ViewStyle } from "react-native";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { useStyle } from "styles/index";
import { RowFrame } from "components/new/icon/row-frame";

export const NotificationSection: FunctionComponent = () => {
  const style = useStyle();
  return (
    <IconWithText
      title={"Notifications"}
      subtitle={"This feature will be available\nin the next releases"}
      icon={<RowFrame />}
      isComingSoon={true}
      titleStyle={style.flatten(["h3"]) as ViewStyle}
    />
  );
};
