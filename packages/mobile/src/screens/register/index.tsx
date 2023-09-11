import React, { FunctionComponent } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { PageWithScrollView } from "../../components/page";
import { useStyle } from "../../styles";
import { View, Dimensions, Image, ViewStyle } from "react-native";
import { Button } from "../../components/button";
import { useSmartNavigation } from "../../navigation";
import { useRegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const RegisterIntroScreen: FunctionComponent = observer(() => {
  const { keyRingStore } = useStore();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const registerConfig = useRegisterConfig(keyRingStore, []);

  const safeAreaInsets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const actualHeightHeight = headerHeight - safeAreaInsets.top;

  return (
    <PageWithScrollView
      backgroundMode="gradient"
      contentContainerStyle={style.get("flex-grow-1")}
      style={{
        ...(style.flatten(["padding-x-42"]) as ViewStyle),
        paddingTop: Dimensions.get("window").height * 0.22 - actualHeightHeight,
        paddingBottom: Dimensions.get("window").height * 0.11,
      }}
    >
      <View
        style={
          style.flatten([
            "flex-grow-1",
            "items-center",
            "padding-x-18",
          ]) as ViewStyle
        }
      >
        <Image
          source={
            style.theme === "dark"
              ? require("../../assets/logo/logo.png")
              : require("../../assets/logo/logo.png")
          }
          style={{
            height: 90,
            aspectRatio: 2.977,
          }}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>
      <Button
        containerStyle={style.flatten(["margin-bottom-16"]) as ViewStyle}
        text="Create a new wallet"
        size="large"
        onPress={() => {
          smartNavigation.navigateSmart("Register.NewUser", {
            registerConfig,
          });
        }}
      />
      <Button
        containerStyle={style.flatten(["margin-bottom-16"]) as ViewStyle}
        text="Import existing wallet"
        size="large"
        mode="light"
        onPress={() => {
          smartNavigation.navigateSmart("Register.NotNewUser", {
            registerConfig,
          });
        }}
      />
      <Button
        containerStyle={{
          display: "none",
        }}
        text="Import Ledger Nano X"
        size="large"
        mode="text"
        onPress={() => {
          smartNavigation.navigateSmart("Register.NewLedger", {
            registerConfig,
          });
        }}
      />
    </PageWithScrollView>
  );
});
