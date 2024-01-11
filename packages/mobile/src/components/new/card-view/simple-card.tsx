import React, { FunctionComponent, ReactElement } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";

export const SimpleCardView: FunctionComponent<{
  trailingIconComponent?: ReactElement | (() => ReactElement);
  mainHeading?: string;
  heading?: string;
  subHeading?: string;
  cardStyle?: ViewStyle;
}> = ({
  trailingIconComponent,
  mainHeading,
  heading,
  subHeading,
  cardStyle,
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
              "padding-y-12",
              "items-center",
            ]),
            cardStyle,
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
                  "font-normal",
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
          <View style={[style.flatten(["flex-1", "items-end"])] as ViewStyle}>
            {trailingIconComponent}
          </View>
        ) : null}
      </BlurBackground>
    </React.Fragment>
  );
};
