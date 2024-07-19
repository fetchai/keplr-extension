import { useStyle } from "styles/index";
import { Text, View, ViewStyle } from "react-native";
import React from "react";

export const DetailRow = ({ label, value }: { label: string; value: any }) => {
  const style = useStyle();
  return (
    <View
      style={
        style.flatten(["flex-row", "items-center", "padding-16"]) as ViewStyle
      }
    >
      <View style={style.flatten(["flex-2"]) as ViewStyle}>
        <Text style={style.flatten(["color-white"]) as ViewStyle}>{label}</Text>
      </View>
      <View style={style.flatten(["flex-3", "items-end"]) as ViewStyle}>
        <Text
          style={style.flatten(["color-gray-200", "text-right"]) as ViewStyle}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
