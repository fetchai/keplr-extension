import { CardModal } from "modals/card";
import React, { FunctionComponent } from "react";
import { Image, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { Button } from "components/button";

export const TransactionSuccessModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  txnHash: string;
  chainId: string;
}> = registerModal(
  ({ txnHash, chainId }) => {
    const style = useStyle();

    return (
      <CardModal
        disableGesture={true}
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
      >
        <IconWithText
          icon={
            <Image
              source={require("assets/image/icon/ic_txn_success.png")}
              fadeDuration={0}
            />
          }
          title={"Transaction successful"}
          subtitle={`Congratulations!\nYour transaction has been completed and confirmed by the blockchain`}
        >
          <Button
            text="Go to homescreen"
            size="large"
            containerStyle={
              style.flatten(["border-radius-64", "margin-top-16"]) as ViewStyle
            }
            rippleColor="black@50%"
          />
        </IconWithText>
      </CardModal>
    );
  },
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
