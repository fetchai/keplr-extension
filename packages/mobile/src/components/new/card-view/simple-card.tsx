import React, { FunctionComponent, ReactElement } from "react";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";

export const SimpleCardView: FunctionComponent<{
  //   trailingIconComponent?: any;
  trailingIconComponent?: ReactElement | (() => ReactElement);
  mainHeading?: string;
  heading?: string;
  subHeading?: string;
  containerStyle?: ViewStyle;
}> = ({
  trailingIconComponent,
  mainHeading,
  heading,
  subHeading,
  containerStyle,
}) => {
  const style = useStyle();

  return (
    <BlurBackground
      borderRadius={12}
      backgroundBlur={true}
      blurIntensity={14}
      containerStyle={
        [
          style.flatten([
            "flex-row",
            "padding-x-18",
            "padding-y-12",
            "items-center",
          ]),
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
                "text-button3",
                "padding-4",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            {subHeading}
          </Text>
        ) : null}
      </View>
      {trailingIconComponent ? (
        <View style={style.flatten(["items-end"]) as ViewStyle}>
          {trailingIconComponent}
        </View>
      ) : null}
    </BlurBackground>
  );
};
