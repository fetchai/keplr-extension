import React, { FunctionComponent } from "react";
import { CardModal } from "modals/card";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
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
    const { analyticsStore, accountStore, chainStore } = useStore();

    const accountInfo = accountStore.getAccount(chainStore.current.chainId);

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        title={title}
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        disableGesture={true}
        close={() => close()}
      >
        <ScrollView
          style={style.flatten(["max-height-600"]) as ViewStyle}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
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
                  {keyStore.selected ? (
                    <Text
                      style={
                        style.flatten([
                          "text-caption1",
                          "color-white",
                        ]) as ViewStyle
                      }
                    >
                      {accountInfo.bech32Address}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={style.flatten(["flex-1", "items-end"]) as ViewStyle}
                >
                  {keyStore.selected ? <CheckIcon /> : null}
                </View>
              </RectButton>
            );
          })}
        </ScrollView>
      </CardModal>
    );
  }),
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
