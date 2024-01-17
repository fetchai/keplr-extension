import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { IconView } from "components/new/button/icon";

export const DropDownCardView: FunctionComponent<{
  trailingIcon?: any;
  mainHeading?: string;
  heading?: string;
  subHeading?: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}> = ({
  trailingIcon,
  mainHeading,
  heading,
  subHeading,
  containerStyle,
  onPress,
}) => {
  const style = useStyle();

  return (
    <React.Fragment>
      {mainHeading ? (
        <Text
          style={
            style.flatten([
              "text-button3",
              "padding-4",
              "margin-y-8",
              "color-gray-200",
            ]) as ViewStyle
          }
        >
          {mainHeading}
        </Text>
      ) : null}
      <BlurBackground
        borderRadius={12}
        blurIntensity={16}
        containerStyle={
          [
            style.flatten([
              "flex-row",
              "padding-x-18",
              "padding-y-8",
              "items-center",
            ]),
            containerStyle,
          ] as ViewStyle
        }
      >
        <View style={style.flatten(["flex-3"]) as ViewStyle}>
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
        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          <IconView backgroundBlur={false} img={trailingIcon} />
        </TouchableOpacity>
      </BlurBackground>
    </React.Fragment>
  );
};
