import React, { FunctionComponent } from "react";
import { ViewStyle } from "react-native";
import { BlurBackground } from "../blur-background/blur-background";

export const IconView: FunctionComponent<{
  iconStyle?: ViewStyle;
  img: any;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  borderRadius?: number;
}> = ({
  iconStyle,
  img,
  backgroundBlur = false,
  blurIntensity,
  borderRadius = 50,
}) => {
  return (
    <BlurBackground
      borderRadius={borderRadius}
      backgroundBlur={backgroundBlur}
      blurIntensity={blurIntensity}
      containerStyle={iconStyle}
    >
      {img}
    </BlurBackground>
  );
};
