import React, { FunctionComponent } from "react";
import { TransitionPresets } from "@react-navigation/stack";
import { TransparentHeaderOptionsPreset } from "components/header";
import { NewHomeScreen } from "screens/home/new";
import { PortfolioScreen } from "screens/portfolio";
import { WebpageScreenScreenOptionsPreset } from "screens/web/components/webpage-screen";
import { FetchhubScreen } from "screens/web/webpages";
import { Stack } from "./navigation";
import { TokenDetail } from "screens/portfolio/token-detail";

export const HomeNavigation: FunctionComponent = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerMode: "screen",
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          headerShown: false,
        }}
        name="Home"
        component={NewHomeScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          headerShown: false,
        }}
        name="Portfolio"
        component={PortfolioScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="NativeTokens"
        component={TokenDetail}
      />
      <Stack.Screen
        options={{
          ...WebpageScreenScreenOptionsPreset,
          headerMode: "screen",
        }}
        name="Fetchhub"
        component={FetchhubScreen}
      />
    </Stack.Navigator>
  );
};
