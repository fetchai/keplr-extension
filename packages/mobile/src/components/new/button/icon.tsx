import React, { FunctionComponent } from "react";
import { ViewStyle } from "react-native";
import {BlurBackground} from "components/new/blur-background/blur-background";

export const IconView: FunctionComponent<{
  iconStyle?: ViewStyle;
  img: any;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  borderRadius?: number;
}> = ({ iconStyle, img, backgroundBlur, blurIntensity, borderRadius = 50 }) => {
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
