import React, { FunctionComponent, ReactElement } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";
// import { LinearTextGradient } from "react-native-text-gradient";

export type HeadingMode = "normal" | "gradient";

export const SimpleCardView: FunctionComponent<{
  trailingIconComponent?: ReactElement | (() => ReactElement);
  mainHeading?: string;
  heading: string;
  headingMode?: HeadingMode;
  subHeading?: string;
  cardStyle?: ViewStyle;
  text?: string;
}> = ({
  trailingIconComponent,
  mainHeading,
  heading,
  headingMode = "normal",
  subHeading,
  cardStyle,
}) => {
  const style = useStyle();

  // function populateGradientText() {
  //   const headingArray = heading.split(" ");
  //   if (headingArray.length / 6 === 2) {
  //     return [headingArray.slice(0, 5), headingArray.slice(6, 11)];
  //   } else if (headingArray.length / 6 === 4) {
  //     return [
  //       headingArray.slice(0, 5),
  //       headingArray.slice(6, 11),
  //       headingArray.slice(12, 17),
  //       headingArray.slice(18, 23),
  //     ];
  //   }
  //
  //   return [] as string[];
  // }

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
        <View style={style.flatten(["flex-8"]) as ViewStyle}>
          {headingMode === "normal" ? (
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
          ) : (
            // Todo

            // <LinearTextGradient
            //   numberOfLines={4}
            //   style={{ fontSize: 14 }}
            //   locations={[1, 0]}
            //   colors={["#F9774B", "#CF447B"]}
            //   start={{ x: 0, y: 1 }}
            //   end={{ x: 1, y: 0 }}
            // >
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
            // </LinearTextGradient>
          )}
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
