import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";

export const IconWithText: FunctionComponent<{
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle, children }) => {
  const style = useStyle();

  return (
    <View style={style.flatten(["flex-column"]) as ViewStyle}>
      <View style={style.flatten(["items-center"]) as ViewStyle}>
        {icon}
        {title ? (
          <Text
            style={
              style.flatten(["h5", "items-center", "color-white"]) as ViewStyle
            }
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={
              style.flatten([
                "body2",
                "color-gray-200",
                "padding-y-8",
                "text-center",
                "font-medium",
              ]) as ViewStyle
            }
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
};
