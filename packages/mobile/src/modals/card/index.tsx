import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {useStyle} from "styles/index";

// CONTRACT: Use with { disableSafeArea: true, align: "bottom" } modal options.
export const CardModal: FunctionComponent<{
  title?: string;
  right?: React.ReactElement;
  childrenContainerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  disableGesture?: boolean;
}> = ({
  title,
  right,
  children,
  childrenContainerStyle,
  disableGesture = false,
  cardStyle,
}) => {
  const style = useStyle();

  return (
    <View
      style={[
        StyleSheet.flatten([
          style.flatten([
            "background-color-indigo-900",
            "border-radius-top-left-32",
            "border-radius-top-right-32",
            "overflow-hidden",
          ]),
        ]) as ViewStyle,
        cardStyle,
      ]}
    >
      <View style={style.flatten(["padding-x-16", "margin-y-10"]) as ViewStyle}>
        <View
          style={
            style.flatten(["items-center", "margin-bottom-16"]) as ViewStyle
          }
        >
          {!disableGesture ? (
            <View style={style.flatten(["margin-top-10"]) as ViewStyle} />
          ) : null}
        </View>
        {title ? (
          <React.Fragment>
            <View
              style={
                style.flatten([
                  "flex-row",
                  "items-center",
                  "justify-between",
                  "padding-x-12",
                ]) as ViewStyle
              }
            >
              <Text
                style={style.flatten(["h4", "color-text-high", "color-white"])}
              >
                {title}
              </Text>
              {right}
            </View>
          </React.Fragment>
        ) : null}
      </View>
      <View
        style={StyleSheet.flatten([
          style.flatten(["padding-x-16", "padding-y-10"]) as ViewStyle,
          childrenContainerStyle,
        ])}
      >
        {children}
      </View>
    </View>
  );
};
