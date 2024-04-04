import { IconButton } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Modal from "react-native-modal";
import { useStyle } from "styles/index";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const CardModal: FunctionComponent<{
  isOpen: boolean;
  title?: string;
  close?: () => void;
  showCloseButton?: boolean;
  childrenContainerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  disableGesture?: boolean;
}> = ({
  isOpen,
  title,
  close,
  showCloseButton = true,
  children,
  childrenContainerStyle,
  disableGesture = false,
  cardStyle,
  titleStyle,
}) => {
  const style = useStyle();

  return (
    <Modal
      testID={"modal"}
      isVisible={isOpen}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
      // customBackdrop={
      //   <BlurBackground
      //     borderRadius={0}
      //     containerStyle={{ flex: 1 }}
      //     blurIntensity={20}
      //   />
      // }
      onBackButtonPress={close}
      onBackdropPress={close}
      animationInTiming={500}
    >
      <GestureHandlerRootView>
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
          <View
            style={style.flatten(["padding-x-16", "margin-y-10"]) as ViewStyle}
          >
            <View
              style={
                style.flatten(["items-center", "margin-bottom-16"]) as ViewStyle
              }
            >
              {!disableGesture ? (
                <View style={style.flatten(["margin-top-10"]) as ViewStyle} />
              ) : null}
            </View>

            <View
              style={
                style.flatten([
                  "flex-row",
                  "items-center",
                  "justify-between",
                  "margin-x-10",
                ]) as ViewStyle
              }
            >
              {title ? (
                <Text
                  style={[
                    style.flatten([
                      "h4",
                      "color-text-high",
                      "color-white",
                      "flex-3",
                    ]),
                    titleStyle,
                  ]}
                >
                  {title}
                </Text>
              ) : null}
              {showCloseButton && close ? (
                <View style={style.flatten(["flex-1", "items-end"])}>
                  <IconButton
                    icon={<XmarkIcon color={"white"} />}
                    backgroundBlur={false}
                    blurIntensity={20}
                    borderRadius={50}
                    onPress={() => close()}
                    iconStyle={
                      style.flatten([
                        "padding-12",
                        "border-width-1",
                        "border-color-gray-400",
                      ]) as ViewStyle
                    }
                  />
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={StyleSheet.flatten([
              style.flatten(["padding-x-20", "padding-y-10"]) as ViewStyle,
              childrenContainerStyle,
            ])}
          >
            {children}
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};
