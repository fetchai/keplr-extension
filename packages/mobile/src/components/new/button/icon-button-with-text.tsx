import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { IconView } from "./icon";

export const IconButtonWithText: FunctionComponent<{
  icon: any;
  text: string;
  backgroundBlur?: boolean;
  borderRadius?: number;
  iconStyle?: ViewStyle;
}> = ({ icon, text, backgroundBlur = true, borderRadius, iconStyle }) => {
  const style = useStyle();
  return (
    <View style={style.flatten(["items-center"]) as ViewStyle}>
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
    </View>
  );
};
