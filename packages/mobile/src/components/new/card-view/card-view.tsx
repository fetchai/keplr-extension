import React, { FunctionComponent } from "react";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";
import { IconView } from "../button/icon";

export const CardView: FunctionComponent<{
  walletImg?: any;
  walletName?: string;
  walletAmount?: string;
  containerStyle?: ViewStyle;
}> = ({ walletImg, walletName, walletAmount, containerStyle }) => {
  const style = useStyle();

  return (
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
          img={walletImg}
          iconStyle={
            style.flatten([
              "padding-11",
              "border-width-1",
              "border-radius-64",
              "border-color-gray-200@20%",
            ]) as ViewStyle
          }
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
            {walletName}
          </Text>
          <Text
            style={style.flatten(["padding-4", "color-gray-200"]) as ViewStyle}
          >
            {"13424.21 FET"}
          </Text>
        </View>
      </View>
      <Text
        style={
          style.flatten(["h6", "color-white", "font-extrabold"]) as ViewStyle
        }
      >
        {`$${walletAmount} USD`}
      </Text>
    </BlurBackground>
  );
};
