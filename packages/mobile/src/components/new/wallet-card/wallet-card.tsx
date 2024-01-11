import React, { FunctionComponent } from "react";
import { CardModal } from "modals/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconView } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";
import { registerModal } from "modals/base";
import { LayerGroupIcon } from "../icon/layer-group";
import { EditIcon } from "../icon/edit";
import { DeleteIcon } from "../icon/color-delete";
import { BorderlessButton } from "react-native-gesture-handler";
import { RectButton } from "components/rect-button";
import { PlusIcon } from "../../icon";
import { BlurBackground } from "components/new/blur-background/blur-background";

export const WalletCardModel: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  onSelectWallet: (option: string) => void;
}> = registerModal(
  ({ close, title, isOpen, onSelectWallet }) => {
    const style = useStyle();

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        title={title}
        cardStyle={style.flatten(["padding-bottom-12"]) as ViewStyle}
        disableGesture={true}
        right={
          <BorderlessButton
            rippleColor={style.get("color-rect-button-default-ripple").color}
            activeOpacity={0.3}
            onPress={() => close()}
          >
            <IconView
              img={<XmarkIcon color={"white"} />}
              backgroundBlur={false}
              blurIntensity={20}
              borderRadius={50}
              iconStyle={
                style.flatten([
                  "padding-12",
                  "border-width-1",
                  "border-color-gray-400",
                ]) as ViewStyle
              }
            />
          </BorderlessButton>
        }
      >
        <View style={style.flatten(["margin-y-12"]) as ViewStyle}>
          <BlurBackground
            borderRadius={12}
            blurIntensity={15}
            containerStyle={style.flatten(["margin-bottom-8"]) as ViewStyle}
          >
            <RectButton
              onPress={() => {
                close();
                onSelectWallet("add_new_wallet");
              }}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={style.flatten(["color-gray-50"]).color}
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-18",
                  ]) as ViewStyle
                }
              >
                <IconView
                  backgroundBlur={false}
                  img={<PlusIcon color={"white"} size={13} />}
                />
                <Text
                  style={
                    style.flatten([
                      "body2",
                      "color-white",
                      "margin-left-18",
                    ]) as ViewStyle
                  }
                >
                  Add new wallet
                </Text>
              </View>
            </RectButton>
          </BlurBackground>
          <BlurBackground
            borderRadius={12}
            blurIntensity={15}
            containerStyle={style.flatten(["margin-bottom-8"]) as ViewStyle}
          >
            <RectButton
              onPress={() => {
                onSelectWallet("change_wallet");
              }}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={style.flatten(["color-gray-50"]).color}
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-18",
                  ]) as ViewStyle
                }
              >
                <IconView
                  backgroundBlur={false}
                  img={<LayerGroupIcon size={17} />}
                />
                <Text
                  style={
                    style.flatten([
                      "body2",
                      "color-white",
                      "margin-left-18",
                    ]) as ViewStyle
                  }
                >
                  Change wallet
                </Text>
              </View>
            </RectButton>
          </BlurBackground>
          <BlurBackground
            borderRadius={12}
            blurIntensity={15}
            containerStyle={style.flatten(["margin-bottom-8"]) as ViewStyle}
          >
            <RectButton
              onPress={() => {
                onSelectWallet("rename_wallet");
              }}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={style.flatten(["color-gray-50"]).color}
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-18",
                  ]) as ViewStyle
                }
              >
                <IconView backgroundBlur={false} img={<EditIcon size={18} />} />
                <Text
                  style={
                    style.flatten([
                      "body2",
                      "color-white",
                      "margin-left-18",
                    ]) as ViewStyle
                  }
                >
                  Rename wallet
                </Text>
              </View>
            </RectButton>
          </BlurBackground>
          <BlurBackground
            borderRadius={12}
            blurIntensity={15}
            containerStyle={style.flatten(["margin-bottom-8"]) as ViewStyle}
          >
            <RectButton
              onPress={() => {
                onSelectWallet("delete_wallet");
              }}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={style.flatten(["color-gray-50"]).color}
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-18",
                  ]) as ViewStyle
                }
              >
                <IconView
                  backgroundBlur={false}
                  img={<DeleteIcon size={17} />}
                />
                <Text
                  style={
                    style.flatten([
                      "body2",
                      "color-white",
                      "margin-left-18",
                      "color-orange-400",
                    ]) as ViewStyle
                  }
                >
                  Delete wallet
                </Text>
              </View>
            </RectButton>
          </BlurBackground>
        </View>
      </CardModal>
    );
  },
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
