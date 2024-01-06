import React, { FunctionComponent, ReactElement } from "react";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";

export const SelectAccountButton: FunctionComponent<{
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  text: string;
  icon?: ReactElement | ((color: string) => ReactElement);
}> = ({
  text,
  icon,
  containerStyle,
  textStyle,
  blurIntensity,
  backgroundBlur = true,
}) => {
  const style = useStyle();
  return (
    <BlurBackground
      borderRadius={32}
      blurIntensity={blurIntensity}
      backgroundBlur={backgroundBlur}
      containerStyle={
        [
          style.flatten(["flex-row", "items-center", "justify-center"]),
          containerStyle,
        ] as ViewStyle
      }
    >
      <Text
        style={[
          style.flatten([
            "color-white",
            "padding-left-4",
            "padding-right-6",
            "padding-y-6",
            "h6",
          ]) as ViewStyle,
          textStyle,
        ]}
      >
        {text}
      </Text>
      <View style={style.flatten(["padding-top-4"]) as ViewStyle}>{icon}</View>
    </BlurBackground>
  );
};
