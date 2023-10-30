import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";

// CONTRACT: Use with { disableSafeArea: true, align: "bottom" } modal options.
export const CardModal: FunctionComponent<{
  title?: string;
  right?: React.ReactElement;
  childrenContainerStyle?: ViewStyle;

  disableGesture?: boolean;
}> = ({
  title,
  right,
  children,
  childrenContainerStyle,

  disableGesture = false,
}) => {
  const style = useStyle();

  return (
    <View
      style={StyleSheet.flatten([
        style.flatten([
            "background-color-indigo-400",
            "border-radius-top-left-32",
            "border-radius-top-right-32",
          "overflow-hidden",
        ]),
      ])}
    >
      <View style={style.flatten(["padding-x-page"]) as ViewStyle}>
        <View
          style={
            style.flatten(["items-center", "margin-bottom-16"]) as ViewStyle
          }
        >
          {!disableGesture ? (
            <View
              style={
                style.flatten([
                    "margin-top-10"
                ]) as ViewStyle
              }
            />
          ) : null}
        </View>
        {title ? (
          <React.Fragment>
            <View
              style={
                style.flatten([
                  "flex-row",
                    "justify-center",
                  "margin-bottom-16",
                ]) as ViewStyle
              }
            >
                <Text style={style.flatten(["h4", "color-text-high", "color-white"])}>
                {title}
              </Text>
              {right}
            </View>
          </React.Fragment>
        ) : null}
      </View>
      <View
        style={StyleSheet.flatten([
          style.flatten(["padding-page", "padding-top-16"]) as ViewStyle,
          childrenContainerStyle,
        ])}
      >
        {children}
      </View>
    </View>
  );
};
