import React, { FunctionComponent } from "react";
import { ViewStyle } from "react-native";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { useStyle } from "styles/index";
import { RowFrame } from "components/new/icon/row-frame";

export const NoActivityView: FunctionComponent = () => {
  const style = useStyle();
  return (
    <IconWithText
      title={"No activity yet"}
      subtitle={
        "Your transaction will appear hear when you\nstart using your wallet "
      }
      icon={<RowFrame />}
      isComingSoon={false}
      titleStyle={style.flatten(["h3"]) as ViewStyle}
      containerStyle={style.flatten(["items-center", "justify-center"])}
    />
  );
};
