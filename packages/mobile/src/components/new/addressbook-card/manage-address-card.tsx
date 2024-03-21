import React, { FunctionComponent } from "react";
import { CardModal } from "modals/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconButton } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";
import { registerModal } from "modals/base";
import { EditIcon } from "../icon/edit";
import { DeleteIcon } from "../icon/color-delete";
import { RectButton } from "components/rect-button";
import { BlurBackground } from "components/new/blur-background/blur-background";

export enum ManageAddressOption {
  renameAddress,
  deleteAddress,
}

export const ManageAddressCardModel: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  onSelectWallet: (option: ManageAddressOption) => void;
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
                onSelectWallet(ManageAddressOption.renameAddress);
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
                <IconButton
                  backgroundBlur={false}
                  icon={<EditIcon size={18} />}
                  iconStyle={style.flatten(["padding-0"]) as ViewStyle}
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
                  Rename
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
                onSelectWallet(ManageAddressOption.deleteAddress);
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
                <IconButton
                  backgroundBlur={false}
                  icon={<DeleteIcon size={17} />}
                  iconStyle={style.flatten(["padding-0"]) as ViewStyle}
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
                  Delete address
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
