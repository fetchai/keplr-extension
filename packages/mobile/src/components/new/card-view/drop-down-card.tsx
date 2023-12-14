import React, { FunctionComponent } from "react";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";
import { IconView } from "../button/icon";

export const DropDownCardView: FunctionComponent<{
  trailingIcon?: any;
  mainHeading?: string;
  heading?: string;
  subHeading?: string;
  containerStyle?: ViewStyle;
}> = ({ trailingIcon, mainHeading, heading, subHeading, containerStyle }) => {
  const style = useStyle();

  return (
    <BlurBackground
      borderRadius={12}
      blurIntensity={16}
      containerStyle={
        [
          style.flatten(["flex-row", "padding-18", "items-center"]),
          containerStyle,
        ] as ViewStyle
      }
    >
      <View style={style.flatten(["flex-3"]) as ViewStyle}>
        {mainHeading ? (
          <Text
            style={
              style.flatten([
                "text-button3",
                "padding-4",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            {mainHeading}
          </Text>
        ) : null}
        {heading ? (
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
            {heading}
          </Text>
        ) : null}
        {subHeading ? (
          <Text
            style={
              style.flatten([
                "text-caption1",
                "padding-4",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            {subHeading}
          </Text>
        ) : null}
      </View>
      <IconView
        backgroundBlur={true}
        img={trailingIcon}
        iconStyle={style.flatten(["padding-11"]) as ViewStyle}
      />
    </BlurBackground>
  );
};
