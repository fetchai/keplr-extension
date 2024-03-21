import React, { FunctionComponent } from "react";
import { Camera, CameraProps } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useStyle } from "styles/index";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingSpinner } from "components/spinner";
import { IconButton } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";

interface CameraProp extends CameraProps {
  containerBottom?: React.ReactElement;
  isLoading?: boolean;
}

export const FullScreenCameraView: FunctionComponent<CameraProp> = (props) => {
  const style = useStyle();

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const { children, containerBottom, isLoading, ...rest } = props;

  return (
    <React.Fragment>
      {isFocused ? (
        <Camera
          style={StyleSheet.flatten([style.flatten(["absolute-fill"])])}
          {...rest}
        />
      ) : null}
      <SafeAreaView style={style.flatten(["absolute-fill", "items-center"])}>
        <View style={style.flatten(["flex-row"])}>
          <View style={style.get("flex-1")} />
          {navigation.canGoBack() ? (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <IconButton
                icon={<XmarkIcon color={"white"} size={18} />}
                backgroundBlur={false}
                borderRadius={50}
                iconStyle={
                  style.flatten([
                    "padding-12",
                    "background-color-indigo-900",
                    "margin-top-10",
                    "margin-right-16",
                  ]) as ViewStyle
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={style.get("flex-1")} />
        <View>
          <Svg width="217" height="217" fill="none" viewBox="0 0 217 217">
            <Path
              stroke={style.get("color-indigo-900").color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
              d="M34 3H3v31M3 183v31h31M183 3h31v31M214 183v31h-31"
            />
          </Svg>
          {isLoading ? (
            <View
              style={style.flatten([
                "absolute-fill",
                "items-center",
                "justify-center",
              ])}
            >
              <View
                style={
                  style.flatten([
                    "padding-x-32",
                    "padding-top-48",
                    "padding-bottom-31",
                    "background-color-card",
                    "border-radius-8",
                    "items-center",
                  ]) as ViewStyle
                }
              >
                <LoadingSpinner
                  size={42}
                  color={style.flatten(["color-indigo-900"]).color}
                />
                <Text
                  style={
                    style.flatten([
                      "subtitle1",
                      "color-indigo-900",
                      "margin-top-34",
                    ]) as ViewStyle
                  }
                >
                  Loading...
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {containerBottom}
        <View style={style.get("flex-1")} />
      </SafeAreaView>
      {children}
    </React.Fragment>
  );
};
