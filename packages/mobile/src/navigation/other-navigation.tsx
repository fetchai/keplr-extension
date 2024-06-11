import React, { FunctionComponent } from "react";
import { useStyle } from "styles/index";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import {
  BlurHeaderOptionsPreset,
  HeaderOnGradientScreenOptionsPreset,
  HeaderRightButton,
  TransparentHeaderOptionsPreset,
} from "components/header";
import { SendScreen } from "screens/send";
import { ReceiveScreen } from "screens/receive";
import { TokensScreen } from "screens/tokens";
import { CameraScreen } from "screens/camera";
import { GovernanceDetailsScreen, GovernanceScreen } from "screens/governance";
import {
  SettingAddTokenScreen,
  SettingManageTokensScreen,
} from "screens/setting/screens/token";
import { HeaderAddIcon } from "components/header/icon";
import { Stack } from "./navigation";
import { TokenDetail } from "screens/portfolio/token-detail";
import { IconButton } from "components/new/button/icon";
import { ViewStyle } from "react-native";
import { SecurityAndPrivacyScreen } from "screens/setting/screens/security-and-privacy";
import { ViewPrivateDataScreen } from "screens/setting/screens/view-private-data";
import { FetchVersionScreen } from "screens/setting/screens/version";
import { CurrencyScreen } from "screens/setting/screens/currency";
import { RenameWalletScreen } from "screens/rename-account";
import { DeleteWalletScreen } from "screens/delete-account";
import { ActivityDetails } from "screens/activity/activity-details";
import { WebViewScreen } from "screens/web/webpages/webview";
import { StakingDashboardScreen } from "screens/stake";
import { ValidatorListScreen } from "screens/stake";
import { ValidatorDetailsScreen } from "screens/stake";
import { DelegateScreen } from "screens/stake";
import { UndelegateScreen } from "screens/stake";
import { RedelegateScreen } from "screens/stake";
import { SelectorValidatorDetailsScreen } from "screens/stake/validator-details/selector-validator-details";
import { useStore } from "stores/index";

export const OtherNavigation: FunctionComponent = () => {
  const style = useStyle();
  const { analyticsStore } = useStore();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

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
          ...BlurHeaderOptionsPreset,
          title: "Send",
        }}
        name="Send"
        component={SendScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Receive",
        }}
        name="Receive"
        component={ReceiveScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          // Only show the back button.
          title: "",
        }}
        name="NativeTokens"
        component={TokenDetail}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Tokens",
        }}
        name="Tokens"
        component={TokensScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Camera"
        component={CameraScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Governance",
        }}
        name="Governance"
        component={GovernanceScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Proposal",
        }}
        name="Governance Details"
        component={GovernanceDetailsScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          // Only show the back button.
          title: "",
        }}
        name="Staking.Dashboard"
        component={StakingDashboardScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Validator Details",
        }}
        name="Validator.Details"
        component={ValidatorDetailsScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Validator Details",
        }}
        name="SelectorValidator.Details"
        component={SelectorValidatorDetailsScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Choose validator",
        }}
        name="Validator.List"
        component={ValidatorListScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Stake",
        }}
        name="Delegate"
        component={DelegateScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Unstake",
        }}
        name="Undelegate"
        component={UndelegateScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "Choose Validator",
        }}
        name="Redelegate"
        component={RedelegateScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Add a token",
        }}
        name="Setting.AddToken"
        component={SettingAddTokenScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Manage tokens",
          headerRight: () => (
            <HeaderRightButton
              onPress={() => {
                navigation.navigate("Setting.AddToken");
                analyticsStore.logEvent("add_token_icon_click", {
                  pageName: "More",
                });
              }}
            >
              <IconButton
                icon={<HeaderAddIcon size={19} color="white" />}
                backgroundBlur={false}
                iconStyle={
                  style.flatten([
                    "width-54",
                    "border-width-1",
                    "border-color-white@20%",
                    "padding-x-12",
                    "padding-y-6",
                    "justify-center",
                    "items-center",
                  ]) as ViewStyle
                }
              />
            </HeaderRightButton>
          ),
        }}
        name="Setting.ManageTokens"
        component={SettingManageTokensScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,

          title: "Security & Privacy",
        }}
        name="SecurityAndPrivacy"
        component={SecurityAndPrivacyScreen}
      />
      <Stack.Screen
        name="Setting.ViewPrivateData"
        options={{
          ...BlurHeaderOptionsPreset,
        }}
        component={ViewPrivateDataScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "App version",
        }}
        name="Setting.Version"
        component={FetchVersionScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Currency",
        }}
        name="Setting.Currency"
        component={CurrencyScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Rename wallet",
        }}
        name="RenameWallet"
        component={RenameWalletScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          // Only show the back button.
          title: "",
        }}
        name="DeleteWallet"
        component={DeleteWalletScreen}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          // Only show the back button.
          title: "",
        }}
        name="ActivityDetails"
        component={ActivityDetails}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          // Only show the back button.
          title: "",
        }}
        name="Activity"
        component={ActivityDetails}
      />
      <Stack.Screen
        options={{
          ...TransparentHeaderOptionsPreset,
          title: "",
          // Only show the back button.
        }}
        name="WebView"
        component={WebViewScreen}
      />
    </Stack.Navigator>
  );
};
