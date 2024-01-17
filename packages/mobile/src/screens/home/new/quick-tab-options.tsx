import React, { FunctionComponent } from "react";
import {
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
import { observer } from "mobx-react-lite";
import { IconButtonWithText } from "components/new/button/icon-button-with-text";
import { Gradient } from "components/new/gradient";
import { IconView } from "components/new/button/icon";
import { ArrowDownIcon } from "components/new/icon/arrow-down";
import { ArrowUpIcon } from "components/new/icon/arrow-up";
import { StakeIcon } from "components/new/icon/stake-icon";
import { NewBridgeIcon } from "components/new/icon/new-bridge-icon";
import { XmarkIcon } from "components/new/icon/xmark";

export const QuickTabOption: FunctionComponent<{
  containerStyle?: ViewStyle;
  isOpen: boolean;
  close: () => void;
  onPress: (event: string) => void;
}> = registerModal(
  observer(({ containerStyle, isOpen, close, onPress }) => {
    const style = useStyle();
    const sectionCardList = [
      { title: "Receive", icon: <ArrowDownIcon color={"#000D3D"} /> },
      { title: "Send", icon: <ArrowUpIcon color={"#000D3D"} /> },
      { title: "Earn", icon: <StakeIcon color={"#000D3D"} /> },
      { title: "Bridge", icon: <NewBridgeIcon color={"#000D3D"} /> },
    ];

    if (!isOpen) {
      return null;
    }

    const renderItem = ({ item }: any) => {
      return (
        <IconButtonWithText
          key={item.title.toLowerCase()}
          icon={item.icon}
          text={item.title}
          iconStyle={
            style.flatten([
              "background-color-white",
              "margin-x-14",
            ]) as ViewStyle
          }
          onPress={() => {
            close();
            onPress(item.title);
          }}
        />
      );
    };
    return (
      <Gradient
        fromColor={style.get("color-indigo-900@10%").color}
        opacityColor1={0.5}
        opacityColor2={0.9}
        toColor={style.get("color-indigo-900").color}
      >
        <View
          style={
            [
              style.flatten(["height-full", "justify-end"]),
              {
                paddingBottom: Platform.OS === "ios" ? 58 : 26,
              },
            ] as ViewStyle
          }
        >
          <FlatList
            data={sectionCardList}
            renderItem={renderItem}
            horizontal={true}
            contentContainerStyle={[
              style.flatten([
                "padding-x-28",
                "margin-bottom-40",
                "justify-center",
                "width-full",
                "items-end",
              ]) as ViewStyle,
              containerStyle,
            ]}
            keyExtractor={(item) => item.title}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            style={style.flatten(["items-center"]) as ViewStyle}
            onPress={close}
          >
            <IconView
              img={<XmarkIcon size={12} color={"white"} />}
              blurIntensity={15}
              iconStyle={
                style.flatten([
                  "padding-16",
                  "border-width-1",
                  "border-radius-64",
                  "border-color-gray-400",
                ]) as ViewStyle
              }
            />
          </TouchableOpacity>
        </View>
      </Gradient>
    );
  }),
  {
    disableSafeArea: true,
    // disableClosingOnBackdropPress: true,
  }
);
