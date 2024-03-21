import { CardModal } from "modals/card";
import React, { FunctionComponent } from "react";
import { Image, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";

export const NetworkErrorModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
}> = registerModal(
  () => {
    const style = useStyle();

    return (
      <React.Fragment>
        <CardModal
          disableGesture={true}
          cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        >
          <IconWithText
            icon={
              <Image
                source={require("assets/image/icon/ic_nw_error.png")}
                fadeDuration={0}
              />
            }
            title={"Network error"}
            subtitle={"Please make sure your device has internet connection."}
          />
        </CardModal>
      </React.Fragment>
    );
  },
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
    disableClosingOnBackdropPress: true,
  }
);
