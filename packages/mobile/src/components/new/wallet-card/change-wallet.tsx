import React, { FunctionComponent } from "react";
import { CardModal } from "../../../modals/card";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { IconView } from "../button/icon";
import { XmarkIcon } from "../../icon/new/xmark";
import { registerModal } from "../../../modals/base";
import { BorderlessButton } from "react-native-gesture-handler";
import { RectButton } from "../../rect-button";
import { CheckIcon } from "../../icon/new/check";
import { Button } from "../../button";
import { ColorPlusIcon } from "../../icon/new/color-plus";
import { useStore } from "../../../stores";
import { MultiKeyStoreInfoWithSelectedElem } from "@keplr-wallet/background";
import { observer } from "mobx-react-lite";
import { KeyRingStore } from "@keplr-wallet/stores";

export const ChangeWalletCardModel: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  keyRingStore: KeyRingStore;
  onClickButton: () => void;
  onChangeAccount: (
    keyStore: MultiKeyStoreInfoWithSelectedElem
  ) => Promise<void>;
}> = registerModal(
  observer(
    ({
      close,
      title,
      isOpen,
      keyRingStore,
      onClickButton,
      onChangeAccount,
    }) => {
      const style = useStyle();
      const { analyticsStore } = useStore();

      if (!isOpen) {
        return null;
      }

      const clickButton = () => {
        close();
        onClickButton();
      };

      return (
        <CardModal
          title={title}
          disableGesture={true}
          right={
            <BorderlessButton
              rippleColor={style.get("color-rect-button-default-ripple").color}
              activeOpacity={0.3}
              onPress={() => close()}
            >
              <IconView
                img={<XmarkIcon />}
                backgroundBlur={true}
                blurIntensity={20}
                borderRadius={50}
                iconStyle={style.flatten(["padding-12"]) as ViewStyle}
              />
            </BorderlessButton>
          }
        >
          <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
            {keyRingStore.multiKeyStoreInfo.map((keyStore, i) => {
              return (
                <RectButton
                  key={i.toString()}
                  onPress={async () => {
                    if (!keyStore?.selected) {
                      close();
                      analyticsStore.logEvent("Account changed");
                      await onChangeAccount(keyStore);
                    }
                  }}
                  activeOpacity={0.5}
                  style={
                    style.flatten(
                      [
                        "flex-row",
                        "items-center",
                        "padding-16",
                        "border-radius-12",
                      ],
                      [keyStore.selected && "background-color-indigo"]
                    ) as ViewStyle
                  }
                  underlayColor={style.flatten(["color-gray-50"]).color}
                >
                  <View style={style.flatten(["flex-3"]) as ViewStyle}>
                    <Text
                      style={
                        style.flatten([
                          "body2",
                          "color-white",
                          "padding-bottom-10",
                        ]) as ViewStyle
                      }
                    >
                      {keyStore.meta?.["name"] || "Fetch Account"}
                    </Text>
                    {/* <Text style={style.flatten(["color-white"]) as ViewStyle}>
                    {"fetch1pneh5rcwhtfk3zttq3ntuwzejaucmzzdpeqe8z"}
                  </Text> */}
                  </View>
                  <View
                    style={style.flatten(["flex-1", "items-end"]) as ViewStyle}
                  >
                    {keyStore.selected ? <CheckIcon /> : null}
                  </View>
                </RectButton>
              );
            })}
            <Button
              containerStyle={
                style.flatten([
                  "background-color-white",
                  "border-radius-64",
                  "margin-y-24",
                ]) as ViewStyle
              }
              textStyle={
                style.flatten([
                  "color-indigo-900",
                  "margin-right-12",
                ]) as ViewStyle
              }
              rightIcon={<ColorPlusIcon />}
              text="Add new wallet"
              size="large"
              rippleColor="black@50%"
              onPress={clickButton}
            />
          </View>
        </CardModal>
      );
    }
  ),
  {
    disableSafeArea: true,
    // disableClosingOnBackdropPress: true,
  }
);
