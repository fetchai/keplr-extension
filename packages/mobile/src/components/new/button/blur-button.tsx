import React, { FunctionComponent, ReactElement } from "react";
import { Text, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";

export const BlurButton: FunctionComponent<{
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  borderRadius?: number;
  blurType?: "extraLight" | "dark";
  onPress?: () => void;
  disable?: boolean;
  text: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}> = ({
  containerStyle,
  textStyle,
  backgroundBlur = true,
  text,
  blurIntensity = 30,
  borderRadius = 8,
  blurType,
  onPress,
  disable,
  leftIcon,
  rightIcon,
}) => {
  const style = useStyle();
  return (
    <BlurBackground
      borderRadius={borderRadius}
      backgroundBlur={backgroundBlur}
      blurIntensity={!disable ? blurIntensity : 15}
      blurType={blurType}
      onPress={disable ? undefined : onPress}
      containerStyle={
        [
          style.flatten(["flex-row", "items-center"]),
          containerStyle,
        ] as ViewStyle
      }
    >
      {leftIcon ? leftIcon : null}
      <Text
        style={[
          style.flatten([
            "color-white",
            "font-bold",
            "margin-y-6",
            "h6",
          ]) as ViewStyle,
          textStyle,
        ]}
      >
        {text}
      </Text>
      {rightIcon ? rightIcon : null}
    </BlurBackground>
  );
};
