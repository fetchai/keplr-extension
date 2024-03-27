import React, { FunctionComponent, useRef } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { Platform, ScrollView, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { useStyle } from "styles/index";
import { ColumnFrame } from "components/new/icon/column-frame";

export const ActivityTab: FunctionComponent = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const safeAreaInsets = useSafeAreaInsets();
  const style = useStyle();
  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
        height: "100%",
        justifyContent: "center",
      }}
      ref={scrollViewRef}
    >
      <IconWithText
        title={"Activity"}
        subtitle={"This feature will be available\nin the next releases"}
        icon={<ColumnFrame />}
        isComingSoon={true}
        titleStyle={style.flatten(["h3"]) as ViewStyle}
      />
    </PageWithScrollViewInBottomTabView>
  );
};
