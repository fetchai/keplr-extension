import { CardModal } from "modals/card";
import React, { FunctionComponent } from "react";
import { Linking, Platform, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { Button } from "components/button";
import LottieView from "lottie-react-native";

export const AppUpdateModal: FunctionComponent<{
  isOpen: boolean;
}> = ({ isOpen }) => {
  const style = useStyle();

  if (!isOpen) {
    return null;
  }

  return (
    <CardModal isOpen={isOpen} disableGesture={true} showCloseButton={false}>
      <IconWithText
        icon={
          <LottieView
            source={require("assets/lottie/app-update.json")}
            autoPlay
            speed={1}
            loop={true}
            style={[style.flatten(["height-122"])] as ViewStyle}
          />
        }
        iconStyle={style.flatten(["margin-bottom-24"]) as ViewStyle}
        title={"New update is available"}
        subtitle={
          "The current version of the application is no longer supported. We apologise for any inconvenience we may have caused you."
        }
        titleStyle={style.flatten(["body1"]) as ViewStyle}
        subtitleStyle={
          style.flatten(["body3", "padding-y-0", "margin-top-6"]) as ViewStyle
        }
      />
      <Button
        containerStyle={
          style.flatten(["border-radius-32", "margin-top-24"]) as ViewStyle
        }
        textStyle={style.flatten(["body3"]) as ViewStyle}
        text={"Update"}
        onPress={() =>
          Linking.openURL(
            Platform.OS === "ios"
              ? "https://apps.apple.com/in/app/fetch-ai-wallet/id1641087356"
              : "https://play.google.com/store/apps/details?id=com.fetchai.wallet"
          )
        }
      />
    </CardModal>
  );
};
