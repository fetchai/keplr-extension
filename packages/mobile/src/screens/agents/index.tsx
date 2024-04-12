import React, { FunctionComponent, useRef } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { Platform, ScrollView, Text, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { useStyle } from "styles/index";
import { ColumnFrame } from "components/new/icon/column-frame";

export const AgentTab: FunctionComponent = () => {
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
        title={"Chat with autonomous agents"}
        subtitle={"This feature will be available\nin the next releases"}
        icon={<ColumnFrame />}
        isComingSoon={true}
        titleStyle={style.flatten(["h3"]) as ViewStyle}
      >
        <Text
          style={
            style.flatten([
              "body2",
              "color-gray-200",
              "padding-y-8",
              "text-center",
              "font-medium",
            ]) as ViewStyle
          }
        >
          {"You can use this feature in your\nbrowser extension."}
        </Text>
      </IconWithText>
    </PageWithScrollViewInBottomTabView>
  );
};
