import React from "react";
import { Text, TextInput, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";

import { observer } from "mobx-react-lite";

export const InputCardView: React.forwardRef<
  TextInput,
  React.ComponentProps<typeof TextInput> & {
    label?: string;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    placeholderText?: string;
    value?: any;
  }
> = observer((props) => {
  const { label, containerStyle, inputContainerStyle, ...restProps } = props;
  const style = useStyle();

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          style={
            style.flatten([
              "padding-y-4",
              "color-gray-200",
              "margin-y-8",
            ]) as ViewStyle
          }
        >
          {label}
        </Text>
      ) : null}
      <BlurBackground
        borderRadius={12}
        blurIntensity={16}
        containerStyle={
          [
            style.flatten(["padding-y-12", "padding-x-18"]),
            inputContainerStyle,
          ] as ViewStyle
        }
      >
        <View style={style.flatten([]) as ViewStyle}>
          <TextInput
            placeholderTextColor={style.flatten(["color-gray-200"]).color}
            style={
              style.flatten(["h6", "color-white", "padding-0"]) as ViewStyle
            }
            returnKeyType="done"
            {...restProps}
          />
        </View>
      </BlurBackground>
    </View>
  );
});
