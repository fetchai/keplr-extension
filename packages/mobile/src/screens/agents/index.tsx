import React, { FunctionComponent, useRef } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { Platform, ScrollView, Text } from "react-native";
import { observer } from "mobx-react-lite";
import { useStyle } from "styles/index";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AgentsScreen: FunctionComponent = observer(() => {
  const style = useStyle();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={scrollViewRef}
    >
      <Text style={style.flatten(["h5", "color-white"])}>Coming Soon</Text>
    </PageWithScrollViewInBottomTabView>
  );
});
