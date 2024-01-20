import React, { FunctionComponent, ReactElement } from "react";
import { View, Text, ViewStyle, TouchableOpacity } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { IconButton } from "components/new/button/icon";

export const TokenCardView: FunctionComponent<{
  containerStyle?: ViewStyle;
  leadingIcon?: ReactElement;
  title: string;
  subtitle: string;
  trailingStart?: string;
  trailingEnd?: string;
  onPress?: () => void;
}> = ({
  leadingIcon,
  title,
  subtitle,
  onPress,
  trailingStart,
  trailingEnd,
  containerStyle,
}) => {
  const style = useStyle();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <BlurBackground
        borderRadius={12}
        blurIntensity={16}
        containerStyle={
          [
            style.flatten([
              "flex-row",
              "padding-18",
              "justify-between",
              "items-center",
            ]),
            containerStyle,
          ] as ViewStyle
        }
      >
        <View style={style.flatten(["flex-row", "items-center"]) as ViewStyle}>
          {leadingIcon ? (
            <IconButton icon={leadingIcon} backgroundBlur={false} />
          ) : null}
          <View style={style.flatten(["margin-left-10"]) as ViewStyle}>
            <Text
              style={
                style.flatten([
                  "h6",
                  "padding-4",
                  "color-white",
                  "font-medium",
                ]) as ViewStyle
              }
            >
              {title}
            </Text>
            <Text
              style={
                style.flatten(["padding-4", "color-gray-200"]) as ViewStyle
              }
            >
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={style.flatten(["flex-row", "items-center"]) as ViewStyle}>
          {trailingStart ? (
            <Text
              style={
                style.flatten([
                  "h6",
                  "color-white",
                  "font-extrabold",
                ]) as ViewStyle
              }
            >
              {trailingStart}
            </Text>
          ) : null}
          {trailingEnd ? (
            <Text
              style={
                style.flatten([
                  "h6",
                  "color-gray-300",
                  "font-extrabold",
                  "margin-left-8",
                ]) as ViewStyle
              }
            >
              {trailingEnd}
            </Text>
          ) : null}
        </View>
      </BlurBackground>
    </TouchableOpacity>
  );
};
