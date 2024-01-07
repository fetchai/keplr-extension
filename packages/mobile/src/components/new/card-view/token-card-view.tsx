import React, { FunctionComponent } from "react";
import { View, Text, ViewStyle, TouchableOpacity } from "react-native";
import {useStyle} from "styles/index";
import {BlurBackground} from "components/new/blur-background/blur-background";
import {IconView} from "components/new/button/icon";
import { Currency } from "@keplr-wallet/types";
import { CoinPretty } from "@keplr-wallet/unit";
import { TokenSymbol } from "../../token-symbol";

export const TokenCardView: FunctionComponent<{
  containerStyle?: ViewStyle;
  chainInfo: {
    stakeCurrency: Currency;
  };
  balance: CoinPretty;
  onPress?: () => void;
}> = ({ chainInfo, balance, onPress, containerStyle }) => {
  const style = useStyle();

  const balanceCoinDenom = (() => {
    if (
      "originCurrency" in balance.currency &&
      balance.currency.originCurrency
    ) {
      return balance.currency.originCurrency.coinDenom;
    }
    return balance.currency.coinDenom;
  })();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <BlurBackground
        borderRadius={12}
        blurIntensity={16}
        containerStyle={
          [
            style.flatten([
              "flex-row",
              "padding-18",
              "justify-between",
              "items-center",
            ]),
            containerStyle,
          ] as ViewStyle
        }
      >
        <View style={style.flatten(["flex-row", "items-center"]) as ViewStyle}>
          <IconView
            img={
              <TokenSymbol
                size={36}
                chainInfo={chainInfo}
                currency={balance.currency}
              />
            }
            backgroundBlur={false}
          />
          <View style={style.flatten(["margin-left-10"]) as ViewStyle}>
            <Text
              style={
                style.flatten([
                  "h6",
                  "padding-4",
                  "color-white",
                  "font-medium",
                ]) as ViewStyle
              }
            >
              {balance.currency.coinDenom}
            </Text>
            <Text
              style={
                style.flatten(["padding-4", "color-gray-200"]) as ViewStyle
              }
            >
              {`${balance
                .trim(true)
                .shrink(true)
                .maxDecimals(6)
                .upperCase(true)
                .hideDenom(true)
                .toString()} ${balanceCoinDenom}`}
            </Text>
          </View>
        </View>
        <Text
          style={
            style.flatten(["h6", "color-white", "font-extrabold"]) as ViewStyle
          }
        >
          {`100000 USD`}
        </Text>
      </BlurBackground>
    </TouchableOpacity>
  );
};
