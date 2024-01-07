import React, { FunctionComponent } from "react";
import { Text, TextInput, View, ViewStyle } from "react-native";
import {useStyle} from "styles/index";
import {BlurBackground} from "components/new/blur-background/blur-background";

import { observer } from "mobx-react-lite";

export const InputCardView: FunctionComponent<{
  label?: string;
  containerStyle?: ViewStyle;
  placeholderText?: string;
}> = observer(({ label, containerStyle, placeholderText }) => {
  const style = useStyle();

  return (
    <React.Fragment>
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
            style.flatten(["padding-18", "flex-row"]),
            containerStyle,
          ] as ViewStyle
        }
      >
        <View style={style.flatten(["flex-3"]) as ViewStyle}>
          <TextInput
            placeholderTextColor={style.flatten(["color-gray-200"]).color}
            style={
              style.flatten(["h6", "color-white", "padding-0"]) as ViewStyle
            }
            returnKeyType="done"
            placeholder={placeholderText}
          />
        </View>
      </BlurBackground>
    </React.Fragment>
  );
});
