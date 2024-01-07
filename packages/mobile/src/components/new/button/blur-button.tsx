import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import {useStyle} from "styles/index";
import {BlurBackground} from "components/new/blur-background/blur-background";

export const BlurButton: FunctionComponent<{
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  borderRadius?: number;
  blurType?: "extraLight" | "dark";
  onPress?: () => void;
  text: string;
}> = ({
  containerStyle,
  textStyle,
  backgroundBlur,
  text,
  blurIntensity,
  borderRadius = 8,
  blurType,
  onPress,
}) => {
  const style = useStyle();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <BlurBackground
        borderRadius={borderRadius}
        backgroundBlur={backgroundBlur}
        blurIntensity={blurIntensity}
        blurType={blurType}
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
    </TouchableOpacity>
  );
};
