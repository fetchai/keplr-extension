import React, { FunctionComponent } from "react";
import { ViewStyle } from "react-native";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { useStyle } from "styles/index";
import { ColumnFrame } from "components/new/icon/column-frame";

export const ChatSection: FunctionComponent = () => {
  const style = useStyle();
  return (
    <IconWithText
      title={"Chat"}
      subtitle={"This feature will be available\nin the next releases"}
      icon={<ColumnFrame />}
      isComingSoon={true}
      titleStyle={style.flatten(["h3"]) as ViewStyle}
    />
  );
};
