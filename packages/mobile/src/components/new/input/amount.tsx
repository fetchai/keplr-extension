import React, { FunctionComponent, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
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
import { IconView } from "../button/icon";
import { BlurButton } from "../button/blur-button";
import { ReloadIcon } from "../../icon/new/reload-icon";
import { useStyle } from "../../../styles";
import * as RNLocalize from "react-native-localize";

export const AmountInputSection: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  errorLabelStyle?: TextStyle;

  amountConfig: IAmountConfig;
}> = observer(
  ({ labelStyle, containerStyle, errorLabelStyle, amountConfig }) => {
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
        style={style.flatten(["h1", "height-50", "color-white"]) as ViewStyle}
        inputContainerStyle={
          style.flatten([
            "border-width-0",
            "padding-x-0",
            "padding-y-0",
          ]) as ViewStyle
        }
        containerStyle={
          [
            style.flatten(["padding-0", "padding-y-12"]),
            containerStyle,
          ] as ViewStyle
        }
        placeholder="0"
        placeholderTextColor={"white"}
        errorLabelStyle={errorLabelStyle}
        value={amountConfig.amount}
        selection={selection}
        onSelectionChange={handleFocus}
        onChangeText={(text) => {
          amountConfig.setAmount(text);
        }}
        topInInputContainer={
          <Text
            style={
              [style.flatten(["h6", "color-gray-100"]), labelStyle] as ViewStyle
            }
          >
            {"Amount"}
          </Text>
        }
        bottomInInputContainer={
          <Text
            style={
              style.flatten(["text-caption1", "color-gray-100"]) as ViewStyle
            }
          >
            {"$0.00 USD"}
          </Text>
        }
        inputRight={
          <View style={style.flatten(["flex-row"])}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                amountConfig.setAmount("");
              }}
            >
              <IconView
                img={<ReloadIcon size={21} />}
                backgroundBlur={true}
                iconStyle={
                  style.flatten([
                    "padding-8",
                    "margin-left-18",
                    "margin-right-12",
                  ]) as ViewStyle
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
              <BlurButton
                text="Max"
                borderRadius={32}
                backgroundBlur={true}
                containerStyle={
                  style.flatten(["justify-center", "padding-x-10"]) as ViewStyle
                }
                textStyle={style.flatten(["text-button2"]) as ViewStyle}
              />
            </TouchableOpacity>
          </View>
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
  }
);
