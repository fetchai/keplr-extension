import React, { FunctionComponent } from "react";
import { CardModal } from "../../../modals/card";
import { View, Text, ViewStyle } from "react-native";
import { useStyle } from "../../../styles";
import { IconView } from "../button/icon";
import { XmarkIcon } from "../../icon/new/xmark";
import { registerModal } from "../../../modals/base";
import { LayerGroupIcon } from "../../icon/new/layer-group";
import { EditIcon } from "../../icon/new/edit";
import { DeleteIcon } from "../../icon/new/color-delete";
import { BorderlessButton } from "react-native-gesture-handler";
import { RectButton } from "../../rect-button";

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
        disableGesture={true}
        right={
          <BorderlessButton
            rippleColor={style.get("color-rect-button-default-ripple").color}
            activeOpacity={0.3}
            onPress={() => close()}
          >
            <IconView
              img={<XmarkIcon />}
              backgroundBlur={true}
              blurIntensity={20}
              borderRadius={50}
              iconStyle={style.flatten(["padding-12"]) as ViewStyle}
            />
          </BorderlessButton>
        }
      >
        <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
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
                  "padding-y-18",
                  "padding-x-12",
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
                    "margin-left-10",
                  ]) as ViewStyle
                }
              >
                {"Change Wallet"}
              </Text>
            </View>
          </RectButton>
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
                  "padding-y-18",
                  "padding-x-12",
                ]) as ViewStyle
              }
            >
              <IconView backgroundBlur={false} img={<EditIcon size={18} />} />
              <Text
                style={
                  style.flatten([
                    "body2",
                    "color-white",
                    "padding-left-10",
                  ]) as ViewStyle
                }
              >
                {"Rename Wallet"}
              </Text>
            </View>
          </RectButton>
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
                  "padding-y-18",
                  "padding-x-12",
                ]) as ViewStyle
              }
            >
              <IconView backgroundBlur={false} img={<DeleteIcon size={17} />} />
              <Text
                style={
                  style.flatten([
                    "body2",
                    "color-white",
                    "padding-left-10",
                    "color-orange-400",
                  ]) as ViewStyle
                }
              >
                {"Delete Wallet"}
              </Text>
            </View>
          </RectButton>
        </View>
      </CardModal>
    );
  },
  {
    disableSafeArea: true,
    // disableClosingOnBackdropPress: true,
  }
);
