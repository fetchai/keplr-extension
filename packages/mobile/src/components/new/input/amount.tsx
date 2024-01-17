import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Platform, Text, View, ViewStyle } from "react-native";
import {
  EmptyAmountError,
  IAmountConfig,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError,
} from "@keplr-wallet/hooks";
import { TextInput } from "components/input";
import { useStyle } from "styles/index";
import * as RNLocalize from "react-native-localize";
import { ReloadIcon } from "../icon/reload-icon";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import { useStore } from "stores/index";
import { parseDollarAmount } from "utils/format/format";
import { BlurButton } from "../button/blur-button";

export const AmountInputSection: FunctionComponent<{
  amountConfig: IAmountConfig;
}> = observer(({ amountConfig }) => {
  const style = useStyle();
  const { priceStore } = useStore();
  const [isToggleClicked, setIsToggleClicked] = useState<boolean>(false);
  const [inputInUsd, setInputInUsd] = useState<string | undefined>("");
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

  const convertToUsd = (currency: any) => {
    const value = priceStore.calculatePrice(currency);
    const inUsd = value && value.shrink(true).maxDecimals(6).toString();
    return inUsd;
  };

  useEffect(() => {
    const amountInNumber =
      parseFloat(amountConfig.amount) *
      10 ** amountConfig.sendCurrency.coinDecimals;
    const inputValue = new CoinPretty(
      amountConfig.sendCurrency,
      new Int(amountConfig.amount ? amountInNumber : 0)
    );
    const inputValueInUsd = convertToUsd(inputValue);
    setInputInUsd(inputValueInUsd);
  }, [amountConfig.amount]);

  const error = amountConfig.error;
  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        case EmptyAmountError:
          // No need to show the error to user.x
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
    <React.Fragment>
      <TextInput
        style={
          style.flatten(
            ["h1", "height-58", "text-center", "flex-0"],
            [errorText ? "color-red-400" : "color-white"]
          ) as ViewStyle
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
        maxLength={18}
        placeholder="0"
        innerInputContainerStyle={style.flatten([
          "justify-center",
          "flex-wrap",
        ])}
        inputRight={
          <Text
            style={
              style.flatten([
                "h1",
                "color-gray-300",
                "margin-left-8",
              ]) as ViewStyle
            }
          >
            {isToggleClicked === true
              ? "USD"
              : amountConfig.sendCurrency.coinDenom}
          </Text>
        }
        placeholderTextColor={errorText ? "red" : "white"}
        value={
          isToggleClicked === true
            ? parseDollarAmount(inputInUsd).toString()
            : amountConfig.amount
        }
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
          <Text
            style={
              style.flatten([
                "text-caption1",
                "color-gray-100",
                "text-center",
              ]) as ViewStyle
            }
          >
            {isToggleClicked === true
              ? `${amountConfig.amount} ${amountConfig.sendCurrency.coinDenom}`
              : inputInUsd
              ? `${inputInUsd} USD`
              : ""}
          </Text>
        }
        error={errorText}
        errorLabelStyle={
          style.flatten(["width-full", "text-center"]) as ViewStyle
        }
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
      <View style={style.flatten(["flex-1"])} />
      <View
        style={
          style.flatten([
            "flex-row",
            "justify-between",
            "margin-top-28",
          ]) as ViewStyle
        }
      >
        <BlurButton
          text="Change to USD"
          backgroundBlur={false}
          leftIcon={
            <View style={style.flatten(["margin-right-8"]) as ViewStyle}>
              <ReloadIcon size={21} />
            </View>
          }
          borderRadius={32}
          onPress={() =>
            amountConfig.sendCurrency["coinGeckoId"]
              ? setIsToggleClicked(!isToggleClicked)
              : null
          }
          containerStyle={
            style.flatten([
              "border-width-1",
              "border-color-gray-300",
              "padding-x-20",
              "padding-y-6",
            ]) as ViewStyle
          }
          textStyle={style.flatten(["body3", "color-white"]) as ViewStyle}
        />
        <BlurButton
          text="Use max available"
          backgroundBlur={false}
          borderRadius={32}
          onPress={() => {
            setSelection({ start: 0 });
            amountConfig.toggleIsMax();
          }}
          containerStyle={
            style.flatten([
              "border-width-1",
              "border-color-gray-300",
              "padding-x-20",
              "padding-y-6",
            ]) as ViewStyle
          }
          textStyle={style.flatten(["body3", "color-white"]) as ViewStyle}
        />
      </View>
    </React.Fragment>
  );
});
