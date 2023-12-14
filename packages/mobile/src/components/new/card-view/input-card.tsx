import React, { FunctionComponent } from "react";
import { Text, ViewStyle, TextInput, View } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";

import { observer } from "mobx-react-lite";

export const InputCardView: FunctionComponent<{
  label?: string;
  containerStyle?: ViewStyle;
  placeholderText?: string;
}> = observer(({ label, containerStyle, placeholderText }) => {
  const style = useStyle();

  return (
    <BlurBackground
      borderRadius={12}
      blurIntensity={16}
      containerStyle={
        [style.flatten(["padding-18", "flex-row"]), containerStyle] as ViewStyle
      }
    >
      <View style={style.flatten(["flex-3"]) as ViewStyle}>
        {label ? (
          <Text
            style={
              style.flatten(["padding-y-4", "color-gray-200"]) as ViewStyle
            }
          >
            {label}
          </Text>
        ) : null}
        <TextInput
          placeholderTextColor={style.flatten(["color-gray-200"]).color}
          style={style.flatten(["h6", "color-white", "padding-0"]) as ViewStyle}
          returnKeyType="done"
          placeholder={placeholderText}
        />
      </View>
    </BlurBackground>
  );
});
