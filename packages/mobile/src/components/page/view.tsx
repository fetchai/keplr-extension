import React, { FunctionComponent } from "react";
import {
  SafeAreaView,
  ViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "../../styles";
import { useSetFocusedScreen } from "./utils";
import { BackgroundMode, ScreenBackground } from "./background";

export const PageWithView: FunctionComponent<
  ViewProps & {
    disableSafeArea?: boolean;
    backgroundMode: BackgroundMode;
    backgroundBlur?: boolean
  }
> = (props) => {
  const style = useStyle();

  useSetFocusedScreen();

  const {
    style: propStyle,
    disableSafeArea,
    backgroundMode,
      backgroundBlur = false,
    ...restProps
  } = props;

  return (
    <React.Fragment>
        <ScreenBackground backgroundMode={backgroundMode} backgroundBlur={backgroundBlur}/>
      {!disableSafeArea ? (
        <SafeAreaView style={style.get("flex-1")}>
          <View
            style={StyleSheet.flatten([
              style.flatten([
                "flex-1",
                "padding-0",
                "overflow-visible",
              ]) as ViewStyle,
              propStyle,
            ])}
            {...restProps}
          />
        </SafeAreaView>
      ) : (
        <View
          style={StyleSheet.flatten([
            style.flatten([
              "flex-1",
              "padding-0",
              "overflow-visible",
            ]) as ViewStyle,
            propStyle,
          ])}
          {...restProps}
        />
      )}
    </React.Fragment>
  );
};
