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
  HeaderAtSecondaryScreenOptionsPreset,
  HeaderOnGradientScreenOptionsPreset,
  HeaderOnSecondaryScreenOptionsPreset,
  HeaderOnTertiaryScreenOptionsPreset,
  HeaderRightButton,
} from "components/header";
import { SendScreen } from "screens/send";
import { NewSendScreen } from "screens/send/new";
import { ReceiveScreen } from "screens/receive";
import { TokensScreen } from "screens/tokens";
import { CameraScreen } from "screens/camera";
import { ManageWalletConnectScreen } from "screens/manage-wallet-connect";
import {
  DelegateScreen,
  StakingDashboardScreen,
  ValidatorDetailsScreen,
  ValidatorListScreen,
} from "screens/stake";
import { GovernanceDetailsScreen, GovernanceScreen } from "screens/governance";
import { UndelegateScreen } from "screens/stake/undelegate";
import { RedelegateScreen } from "screens/stake/redelegate";
import {
  TxFailedResultScreen,
  TxPendingResultScreen,
  TxSuccessResultScreen,
} from "screens/tx-result";
import {
  SettingAddTokenScreen,
  SettingManageTokensScreen,
} from "screens/setting/screens/token";
import { HeaderAddIcon } from "components/header/icon";
import { Stack } from "./navigation";

export const OtherNavigation: FunctionComponent = () => {
  const style = useStyle();

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleStyle: style.flatten(["h5", "color-text-high"]),
        headerMode: "screen",
      }}
    >
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Send",
        }}
        name="Send"
        component={SendScreen}
      />
      <Stack.Screen
        options={{
          ...BlurHeaderOptionsPreset,
          title: "Send",
        }}
        name="SendNew"
        component={NewSendScreen}
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
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "WalletConnect",
        }}
        name="ManageWalletConnect"
        component={ManageWalletConnectScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Validator Details",
        }}
        name="Validator Details"
        component={ValidatorDetailsScreen}
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
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Staking Dashboard",
        }}
        name="Staking.Dashboard"
        component={StakingDashboardScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnGradientScreenOptionsPreset,
          title: "Validator Details",
        }}
        name="Validator.Details"
        component={ValidatorDetailsScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderAtSecondaryScreenOptionsPreset,
          title: "All Active Validators",
        }}
        name="Validator.List"
        component={ValidatorListScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Stake",
        }}
        name="Delegate"
        component={DelegateScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Unstake",
        }}
        name="Undelegate"
        component={UndelegateScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Switch Validator",
        }}
        name="Redelegate"
        component={RedelegateScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxPendingResult"
        component={TxPendingResultScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxSuccessResult"
        component={TxSuccessResultScreen}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name="TxFailedResult"
        component={TxFailedResultScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnTertiaryScreenOptionsPreset,
          title: "Add Token",
        }}
        name="Setting.AddToken"
        component={SettingAddTokenScreen}
      />
      <Stack.Screen
        options={{
          ...HeaderOnSecondaryScreenOptionsPreset,
          title: "Manage Tokens",
          headerRight: () => (
            <HeaderRightButton
              onPress={() => {
                navigation.navigate("Setting.AddToken");
              }}
            >
              <HeaderAddIcon />
            </HeaderRightButton>
          ),
        }}
        name="Setting.ManageTokens"
        component={SettingManageTokensScreen}
      />
    </Stack.Navigator>
  );
};
