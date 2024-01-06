import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useStore } from "../../stores";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useStyle } from "../../styles";
import { RectButton } from "../rect-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VectorCharacter } from "../vector-character";
import FastImage from "react-native-fast-image";
import { BorderlessButton } from "react-native-gesture-handler";
import { IconView } from "../new/button/icon";
import { XmarkIcon } from "../new/icon/xmark";
import { BlurBackground } from "../new/blur-background/blur-background";
import { CheckIcon } from "../new/icon/check";

export type DrawerContentProps =
  DrawerContentComponentProps<DrawerContentOptions>;

export const DrawerContent: FunctionComponent<DrawerContentProps> = observer(
  (props) => {
    const { chainStore } = useStore();
    const navigation = useNavigation();

    const safeAreaInsets = useSafeAreaInsets();

    const { style: propStyle, ...rest } = props;

    const style = useStyle();

    return (
      <DrawerContentScrollView
        style={StyleSheet.flatten([
          propStyle,
          style.flatten([
            "background-color-indigo-900",
            "dark:background-color-platinum-600",
          ]),
        ])}
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
        }}
        {...rest}
      >
        <View
          style={{
            marginBottom: safeAreaInsets.bottom,
          }}
        >
          <View
            style={
              style.flatten([
                "items-center",
                "height-50",
                "flex-row",
                "margin-bottom-20",
                "margin-left-12",
                "margin-right-12",
              ]) as ViewStyle
            }
          >
            <Text
              style={
                style.flatten([
                  "h5",
                  "color-white",
                  "margin-left-12",
                ]) as ViewStyle
              }
            >
              Change Network
            </Text>
            <View style={style.get("flex-1")} />
            <View
              style={
                style.flatten([
                  "height-1",
                  "justify-center",
                  "items-center",
                  "margin-right-12",
                ]) as ViewStyle
              }
            >
              <BorderlessButton
                rippleColor={
                  style.get("color-rect-button-default-ripple").color
                }
                activeOpacity={0.3}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                }}
              >
                <IconView
                  img={<XmarkIcon />}
                  backgroundBlur={true}
                  blurIntensity={20}
                  borderRadius={50}
                  iconStyle={style.flatten(["padding-12"]) as ViewStyle}
                />
              </BorderlessButton>
            </View>
          </View>
          {chainStore.chainInfosInUI.map((chainInfo) => {
            const selected = chainStore.current.chainId === chainInfo.chainId;

            return (
              <RectButton
                key={chainInfo.chainId}
                onPress={() => {
                  chainStore.selectChain(chainInfo.chainId);
                  chainStore.saveLastViewChainId();
                  navigation.dispatch(DrawerActions.closeDrawer());
                }}
                style={
                  style.flatten(
                    [
                      "flex-row",
                      "height-84",
                      "items-center",
                      "padding-x-20",
                      "margin-left-12",
                      "margin-right-12",
                      "justify-between",
                    ],
                    [selected && "background-color-indigo", "border-radius-12"]
                  ) as ViewStyle
                }
                activeOpacity={0.5}
                underlayColor={
                  style.flatten(["color-gray-50", "dark:color-platinum-500"])
                    .color
                }
              >
                <View
                  style={
                    style.flatten(["flex-row", "items-center"]) as ViewStyle
                  }
                >
                  <BlurBackground
                    backgroundBlur={true}
                    containerStyle={
                      style.flatten([
                        "width-44",
                        "height-44",
                        "border-radius-64",
                        "items-center",
                        "justify-center",
                        // "background-color-gray-100",
                        "dark:background-color-platinum-500",
                        "margin-right-16",
                      ]) as ViewStyle
                    }
                  >
                    {chainInfo.raw.chainSymbolImageUrl ? (
                      <FastImage
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        source={{
                          uri: chainInfo.raw.chainSymbolImageUrl,
                        }}
                      />
                    ) : (
                      <VectorCharacter
                        char={chainInfo.chainName[0]}
                        color="white"
                        height={12}
                      />
                    )}
                  </BlurBackground>
                  <Text style={style.flatten(["h6", "color-white"])}>
                    {chainInfo.chainName}
                  </Text>
                </View>
                <View>{selected ? <CheckIcon /> : null}</View>
              </RectButton>
            );
          })}
        </View>
      </DrawerContentScrollView>
    );
  }
);
