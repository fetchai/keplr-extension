import React, { FunctionComponent, ReactElement } from "react";
import { View, Text, ViewStyle, TouchableOpacity } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";

export const SelectAccountButton: FunctionComponent<{
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  backgroundBlur?: boolean;
  blurIntensity?: number;
  text: string;
  icon?: ReactElement | ((color: string) => ReactElement);
  onPress?: () => void;
}> = ({
  text,
  icon,
  containerStyle,
  textStyle,
  blurIntensity,
  backgroundBlur = true,
  onPress,
}) => {
  const style = useStyle();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
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
              "padding-x-4",
              "padding-y-6",
              "h6",
            ]) as ViewStyle,
            textStyle,
          ]}
        >
          {text}
        </Text>
        <View style={style.flatten(["padding-top-4"]) as ViewStyle}>
          {icon}
        </View>
      </BlurBackground>
    </TouchableOpacity>
  );
};
