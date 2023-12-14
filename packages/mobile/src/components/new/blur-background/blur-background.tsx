import React, { FunctionComponent } from "react";
import { BlurView } from "expo-blur";
import { ViewStyle } from "react-native";

export const BlurBackground: FunctionComponent<{
  borderRadius?: number;
  blurIntensity?: number;
  backgroundBlur?: boolean;
  containerStyle?: ViewStyle;
  blurType?: "extraLight" | "dark";
}> = ({
  borderRadius = 32,
  blurIntensity = 30,
  backgroundBlur = true,
  blurType = "extraLight",
  containerStyle,
  children,
}) => {
  return (
    <BlurView
      intensity={backgroundBlur ? blurIntensity : 0}
      tint={blurType}
      // blurReductionFactor={1}
      // experimentalBlurMethod="dimezisBlurView"
      style={[
        {
          borderRadius: borderRadius,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      {children}
    </BlurView>
  );
};
