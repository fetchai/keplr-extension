import React, { FunctionComponent } from "react";
import { useStyle } from "styles/index";
import { TransitionPresets } from "@react-navigation/stack";
import { SettingScreen } from "screens/setting";
import { Stack } from "./navigation";
import { ViewStyle } from "react-native";

export const MoreNavigation: FunctionComponent = () => {
  const style = useStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]) as ViewStyle,
        headerMode: "screen",
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Setting"
        component={SettingScreen}
      />
    </Stack.Navigator>
  );
};
