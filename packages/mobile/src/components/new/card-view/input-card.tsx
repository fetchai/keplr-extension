import React, { FunctionComponent } from "react";
import { Text, ViewStyle, TextInput } from "react-native";
import { useStyle } from "../../../styles";
import { BlurBackground } from "../blur-background/blur-background";

export const InputCardView: FunctionComponent<{
  label?: string;
  containerStyle?: ViewStyle;
}> = ({ label, containerStyle }) => {
  const style = useStyle();

  return (
    <BlurBackground
      borderRadius={12}
      backgroundBlur={true}
      blurIntensity={14}
      containerStyle={
        [style.flatten(["padding-12"]), containerStyle] as ViewStyle
      }
    >
      {label ? (
        <Text
          style={style.flatten(["padding-4", "color-gray-200"]) as ViewStyle}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        //   inputContainerStyle={style.flatten(["background-color-transparent"])}
        placeholderTextColor={style.flatten(["color-white"]).color}
        style={style.flatten(["h6", "color-white", "padding-y-0"]) as ViewStyle}
        returnKeyType="done"
        //   secureTextEntry={true}
        placeholder="-"
        // value={password}
        // error={isFailed ? "Invalid password" : undefined}
        // onChangeText={setPassword}
        // onSubmitEditing={tryUnlock}
      />
    </BlurBackground>
  );
};
