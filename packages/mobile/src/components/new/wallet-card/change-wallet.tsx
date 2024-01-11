import React, { FunctionComponent } from "react";
import { CardModal } from "modals/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconView } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";
import { registerModal } from "modals/base";
import { BorderlessButton } from "react-native-gesture-handler";
import { RectButton } from "components/rect-button";
import { CheckIcon } from "components/new/icon/check";
import { useStore } from "stores/index";
import { MultiKeyStoreInfoWithSelectedElem } from "@keplr-wallet/background";
import { observer } from "mobx-react-lite";
import { KeyRingStore } from "@keplr-wallet/stores";

export const ChangeWalletCardModel: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  keyRingStore: KeyRingStore;
  onChangeAccount: (
    keyStore: MultiKeyStoreInfoWithSelectedElem
  ) => Promise<void>;
}> = registerModal(
  observer(({ close, title, isOpen, keyRingStore, onChangeAccount }) => {
    const style = useStyle();
    const { analyticsStore } = useStore();

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        title={title}
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        disableGesture={true}
        right={
          <BorderlessButton
            rippleColor={style.get("color-rect-button-default-ripple").color}
            activeOpacity={0.3}
            onPress={() => close()}
          >
            <IconView
              img={<XmarkIcon color={"white"} />}
              backgroundBlur={false}
              blurIntensity={20}
              borderRadius={50}
              iconStyle={
                style.flatten([
                  "padding-12",
                  "border-width-1",
                  "border-color-gray-400",
                ]) as ViewStyle
              }
            />
          </BorderlessButton>
        }
      >
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
                    "padding-18",
                    "margin-y-8",
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
                      keyStore?.selected ? "h6" : "body2",
                      "color-white",
                    ]) as ViewStyle
                  }
                >
                  {keyStore.meta?.["name"] || "Fetch Account"}
                </Text>
              </View>
              <View style={style.flatten(["flex-1", "items-end"]) as ViewStyle}>
                {keyStore.selected ? <CheckIcon /> : null}
              </View>
            </RectButton>
          );
        })}
      </CardModal>
    );
  }),
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
