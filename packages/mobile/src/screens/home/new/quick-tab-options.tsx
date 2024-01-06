import React, { FunctionComponent } from "react";
import {
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "../../../styles";
import Toast from "react-native-toast-message";
import { registerModal } from "../../../modals/base";
import { observer } from "mobx-react-lite";
import { IconButtonWithText } from "../../../components/new/button/icon-button-with-text";
import { Gradient } from "../../../components/new/gradient";
import { IconView } from "../../../components/new/button/icon";
import { ArrowDownIcon } from "../../../components/new/icon/arrow-down";
import { ArrowUpIcon } from "../../../components/new/icon/arrow-up";
import { StakeIcon } from "../../../components/new/icon/stake-icon";
import { NewBridgeIcon } from "../../../components/new/icon/new-bridge-icon";
import { XmarkIcon } from "../../../components/new/icon/xmark";

export const QuickTabOption: FunctionComponent<{
  containerStyle?: ViewStyle;
  isOpen: boolean;
  close: () => void;
}> = registerModal(
  observer(({ containerStyle, isOpen }) => {
    const style = useStyle();
    // const { chainStore } = useStore();
    // const smartNavigation = useSmartNavigation();
    // const chainId = chainStore.current.chainId;

    const sectionCardlist = [
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
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            switch (item.title) {
              case "Receive":
                return console.log("receive");
              case "Send":
                return console.log("send");
              case "Swap":
                return Toast.show({
                  type: "error",
                  text1: `Swap is working`,
                });

              case "Bridge":
                return Toast.show({
                  type: "error",
                  text1: `Bridge is working`,
                });
            }
          }}
        >
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
          />
        </TouchableOpacity>
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
                paddingBottom: Platform.OS === "ios" ? 58 : 16,
              },
            ] as ViewStyle
          }
        >
          <FlatList
            data={sectionCardlist}
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
