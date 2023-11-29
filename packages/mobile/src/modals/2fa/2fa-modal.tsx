import React, { FunctionComponent } from "react";
import { Text, TextInput, View, ViewStyle } from "react-native";
import { registerModal } from "../base";
import { observer } from "mobx-react-lite";
import { useStyle } from "../../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CloseIcon } from "../../components/icon";
import {
  firebaseTxRequestRejected,
  TxRequest,
} from "../../utils/2fa/2fa-transaction";

export const TwoFAModal: FunctionComponent<{
  isOpen: boolean;
  address: string;
  txRequest: TxRequest | undefined;
  close: () => void;
}> = registerModal(
  observer(({ isOpen, close, address, txRequest }) => {
    const style = useStyle();

    if (!isOpen) {
      return null;
    }

    return (
      <View style={style.flatten(["padding-page"]) as ViewStyle}>
        <View
          style={
            style.flatten([
              "border-radius-8",
              "overflow-hidden",
              "background-color-white",
              "dark:background-color-platinum-600",
              "padding-x-16",
              "padding-bottom-28",
              "items-center",
            ]) as ViewStyle
          }
        >
          <View
            style={style.flatten(["flex-row", "margin-top-16"]) as ViewStyle}
          >
            <Text
              style={
                style.flatten(["flex-1", "h3", "margin-bottom-8"]) as ViewStyle
              }
            >
              2FA Request
            </Text>
            <TouchableOpacity
              onPress={async () => {
                close();
                await firebaseTxRequestRejected(
                  txRequest?.address ?? "address"
                );
              }}
            >
              <View
                style={
                  style.flatten([
                    "width-38",
                    "height-38",
                    "border-radius-64",
                    "background-color-blue-100",
                    "dark:background-color-platinum-500",
                    "opacity-90",
                    "items-center",
                    "justify-center",
                  ]) as ViewStyle
                }
              >
                <CloseIcon
                  size={28}
                  color={
                    style.flatten(["color-blue-400", "dark:color-platinum-50"])
                      .color
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={
              style.flatten([
                "body2",
                "color-text-low",
                "margin-bottom-20",
              ]) as ViewStyle
            }
          >
            {address}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {Array.from(txRequest?.code ?? "").map((value, index) => (
              <TextInput
                key={index}
                value={value}
                style={{
                  borderWidth: 1.5,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginRight: 8,
                  width: 40,
                  textAlign: "center",
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }),
  {
    align: "center",
  }
);
