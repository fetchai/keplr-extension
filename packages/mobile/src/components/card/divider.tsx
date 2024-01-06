import React, { FunctionComponent } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";

export const CardDivider: FunctionComponent<{
  style?: ViewStyle;
  verical?: boolean;
}> = ({ style: propStyle, verical = false }) => {
  const style = useStyle();

  return (
    <View
      style={StyleSheet.flatten([
        style.flatten(
          [
            "background-color-gray-200@40%",
            "dark:background-color-platinum-400@40%",
          ],
          verical
            ? ["height-full", "width-1"]
            : ["height-1", "margin-x-card-horizontal"]
        ) as ViewStyle,
        propStyle,
      ])}
    />
  );
};
