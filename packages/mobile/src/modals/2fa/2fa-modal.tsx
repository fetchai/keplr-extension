import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Text, TextInput, View, ViewStyle } from "react-native";
import { registerModal } from "../base";
import { observer } from "mobx-react-lite";
import { useStyle } from "../../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CloseIcon } from "../../components/icon";
import {
  firebaseTxStatusUpdate,
  TxRequest,
} from "../../utils/2fa/2fa-transaction";
import Toast from "react-native-toast-message";

export const TwoFAModal: FunctionComponent<{
  isOpen: boolean;
  address: string;
  txRequest: TxRequest | undefined;
  close: () => void;
}> = registerModal(
  observer(({ isOpen, close, address, txRequest }) => {
    const style = useStyle();
    const [inputValues, setInputValues] = useState(["", "", "", ""]);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
      // Focus on the first input when the component mounts
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }, []);

    const handleChange = (index: number, value: string) => {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 1);

      let newValues: string[] = [];
      setInputValues((prevValues) => {
        newValues = [...prevValues];
        newValues[index] = sanitizedValue;
        return newValues;
      });

      if (sanitizedValue.length === 1 && index < inputValues.length - 1) {
        // Move focus to the next input field
        inputRefs.current[index + 1]?.focus();
      } else if (sanitizedValue.length === 0 && index > 0) {
        // Move focus to the previous input field
        inputRefs.current[index - 1]?.focus();
      }

      ///Todo handle a case where only 3 incorrect attempts allowed
      const inputValue = newValues.join("");
      if (inputValue.length === 4) {
        if (txRequest?.code == inputValue) {
          close();
          (async () => {
            await firebaseTxStatusUpdate(
              txRequest?.address ?? "address",
              "approved"
            );
            setInputValues(["", "", "", ""]);
          })();
        } else {
          Toast.show({
            type: "error",
            text1: "Please enter correct code to proceed",
          });
        }
      }
    };

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
                await firebaseTxStatusUpdate(
                  txRequest?.address ?? "address",
                  "rejected"
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
            {inputValues.map((value, index) => (
              <TextInput
                key={index}
                value={value}
                keyboardType="numeric"
                maxLength={1}
                onChange={(e) => handleChange(index, e.nativeEvent.text)}
                ref={(el) => (inputRefs.current[index] = el)}
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
