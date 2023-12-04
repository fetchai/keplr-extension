import React, { FunctionComponent, useState } from "react";
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
import { ChangeWalletCardModel } from "./change-wallet";

export const MainWalletCardModel: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
}> = registerModal(
  ({ close, title, isOpen }) => {
    const style = useStyle();
    const [changeWalletModal, setChangeWalletModal] = useState(false);

    if (!isOpen) {
      return null;
    }

    return (
      <React.Fragment>
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
                setChangeWalletModal(true);
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
                    "padding-x-6",
                  ]) as ViewStyle
                }
              >
                <IconView img={<LayerGroupIcon size={17} />} />
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
              onPress={() => console.log("Rename Wallet working")}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={
                style.flatten(["color-gray-50", "dark:color-platinum-500"])
                  .color
              }
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-y-18",
                    "padding-x-6",
                  ]) as ViewStyle
                }
              >
                <IconView img={<EditIcon size={18} />} />
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
              onPress={() => console.log("Delete Wallet working")}
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={
                style.flatten(["color-gray-50", "dark:color-platinum-500"])
                  .color
              }
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-y-18",
                    "padding-x-6",
                  ]) as ViewStyle
                }
              >
                <IconView img={<DeleteIcon size={17} />} />
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
        <ChangeWalletCardModel
          isOpen={changeWalletModal}
          title="Change Wallet"
          close={() => setChangeWalletModal(false)}
        />
      </React.Fragment>
    );
  },
  {
    disableSafeArea: true,
    // disableClosingOnBackdropPress: true,
  }
);
