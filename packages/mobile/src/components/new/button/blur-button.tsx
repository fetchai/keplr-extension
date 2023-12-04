import React, { FunctionComponent } from "react";
import { Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";

export const BlurButton: FunctionComponent<{
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  borderRadius?: number;
  text: string;
}> = ({
  containerStyle,
  textStyle,
  backgroundBlur = false,
  text,
  blurIntensity,
  borderRadius = 8,
}) => {
  const style = useStyle();
  return (
    <BlurBackground
      borderRadius={borderRadius}
      backgroundBlur={backgroundBlur}
      blurIntensity={blurIntensity}
      containerStyle={containerStyle}
    >
      <Text
        style={[
          style.flatten([
            "color-white",
            "font-bold",
            "margin-x-14",
            "margin-y-6",
            "h6",
          ]) as ViewStyle,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </BlurBackground>
  );
};
