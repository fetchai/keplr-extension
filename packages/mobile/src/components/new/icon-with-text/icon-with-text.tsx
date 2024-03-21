import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";

export const IconWithText: FunctionComponent<{
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
  iconStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  subtitleStyle?: ViewStyle;
}> = ({
  icon,
  title,
  subtitle,
  iconStyle,
  titleStyle,
  subtitleStyle,
  children,
}) => {
  const style = useStyle();

  return (
    <View style={style.flatten(["flex-column"]) as ViewStyle}>
      <View style={style.flatten(["items-center"]) as ViewStyle}>
        {icon && <View style={iconStyle}>{icon}</View>}
        {title ? (
          <Text
            style={
              [
                style.flatten(["h5", "items-center", "color-white"]),
                titleStyle,
              ] as ViewStyle
            }
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={
              [
                style.flatten([
                  "body2",
                  "color-gray-200",
                  "padding-y-8",
                  "text-center",
                  "font-medium",
                ]),
                subtitleStyle,
              ] as ViewStyle
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
