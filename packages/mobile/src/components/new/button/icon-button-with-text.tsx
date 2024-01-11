import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconView } from "./icon";

export const IconButtonWithText: FunctionComponent<{
  icon: any;
  text: string;
  backgroundBlur?: boolean;
  borderRadius?: number;
  iconStyle?: ViewStyle;
  onPress?: () => void;
}> = ({ icon, text, backgroundBlur, borderRadius, iconStyle, onPress }) => {
  const style = useStyle();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={style.flatten(["items-center"]) as ViewStyle}
    >
      <IconView
        img={icon}
        backgroundBlur={backgroundBlur}
        borderRadius={borderRadius}
        iconStyle={
          [
            style.flatten(["padding-15", "margin-bottom-6"]),
            iconStyle,
          ] as ViewStyle
        }
      />
      <Text style={style.flatten(["color-white"]) as ViewStyle}>{text}</Text>
    </TouchableOpacity>
  );
};
