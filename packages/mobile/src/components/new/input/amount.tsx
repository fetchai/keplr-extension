import React, { FunctionComponent, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  EmptyAmountError,
  IAmountConfig,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError,
} from "@keplr-wallet/hooks";
import { TextInput } from "../../input";
import { useStyle } from "../../../styles";
import * as RNLocalize from "react-native-localize";
import { Button } from "../../button";
import { ReloadIcon } from "../icon/reload-icon";

export const AmountInputSection: FunctionComponent<{
  amountConfig: IAmountConfig;
}> = observer(({ amountConfig }) => {
  const style = useStyle();
  const [selection, setSelection] = useState<
    | {
        start: number;
      }
    | undefined
  >({
    start: 0,
  });
  const handleFocus = () => {
    setSelection(undefined);
  };

  const error = amountConfig.error;
  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        case EmptyAmountError:
          // No need to show the error to user.
          return;
        case InvalidNumberAmountError:
          return "Invalid number";
        case ZeroAmountError:
          return "Amount is zero";
        case NegativeAmountError:
          return "Amount is negative";
        case InsufficientAmountError:
          return "Insufficient fund";
        default:
          return "Unknown error";
      }
    }
  }, [error]);

  return (
    <TextInput
      style={
        style.flatten([
          "h3",
          "height-50",
          "color-white",
          "text-center",
        ]) as ViewStyle
      }
      inputContainerStyle={
        style.flatten([
          "border-width-0",
          "padding-x-0",
          "padding-y-0",
        ]) as ViewStyle
      }
      containerStyle={
        style.flatten(["margin-top-12", "padding-y-0"]) as ViewStyle
      }
      maxLength={20}
      placeholder="0 FET"
      placeholderTextColor={"grey"}
      value={amountConfig.amount}
      selection={selection}
      onSelectionChange={handleFocus}
      onChangeText={(text) => {
        amountConfig.setAmount(text);
      }}
      topInInputContainer={
        <Text
          style={
            [
              style.flatten(["h6", "color-gray-100", "text-center"]),
            ] as ViewStyle
          }
        >
          {"Amount"}
        </Text>
      }
      bottomInInputContainer={
        <React.Fragment>
          <Text
            style={
              style.flatten([
                "text-caption1",
                "color-gray-100",
                "text-center",
              ]) as ViewStyle
            }
          >
            {"$0.00 USD"}
          </Text>
          <View
            style={
              style.flatten([
                "flex-row",
                "justify-center",
                "margin-top-28",
              ]) as ViewStyle
            }
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                amountConfig.setAmount("");
              }}
            >
              <Button
                text="CHANGE TO USD"
                mode={"outline"}
                containerStyle={
                  style.flatten([
                    "margin-x-8",
                    "padding-8",
                    "border-color-gray-200",
                    "border-radius-32",
                  ]) as ViewStyle
                }
                textStyle={style.flatten([
                  "text-caption2",
                  "font-bold",
                  "color-white",
                ])}
                leftIcon={
                  <View style={style.flatten(["margin-right-8"]) as ViewStyle}>
                    <ReloadIcon size={21} />
                  </View>
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={amountConfig.fraction ? 1 : 0.6}
              onPress={() => {
                setSelection({ start: 0 });
                amountConfig.setFraction(1);
              }}
            >
              <Button
                text="USE MAX"
                mode={"outline"}
                containerStyle={
                  style.flatten([
                    "margin-x-8",
                    "padding-8",
                    "border-color-gray-200",
                    "border-radius-32",
                  ]) as ViewStyle
                }
                textStyle={style.flatten([
                  "text-caption2",
                  "font-bold",
                  "color-white",
                ])}
              />
            </TouchableOpacity>
          </View>
        </React.Fragment>
      }
      error={errorText}
      keyboardType={(() => {
        if (Platform.OS === "ios") {
          // In IOS, the numeric type keyboard has a decimal separator "." or "," depending on the language and region of the user device.
          // However, asset input in keplr unconditionally follows the US standard, so it must be ".".
          // However, if only "," appears on the keyboard, "." cannot be entered.
          // In this case, it is inevitable to use a different type of keyboard.
          if (RNLocalize.getNumberFormatSettings().decimalSeparator !== ".") {
            return "numbers-and-punctuation";
          }
          return "numeric";
        } else {
          // In Android, the numeric type keyboard has both "." and ",".
          // So, there is no need to use other keyboard type on any case.
          return "numeric";
        }
      })()}
    />
  );
});
