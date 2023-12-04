import React, { FunctionComponent } from "react";
import { useStyle } from "../../styles";
import { ArrowDownIcon } from "../icon/new/arrow-down";
import { ArrowUpIcon } from "../icon/new/arrow-up";
import { SwapIcon } from "../icon/new/swap-icon";
import { StakeIcon } from "../icon/new/stake-icon";
import { BridgeIcon } from "../icon/new/bridge-icon";
import { HeaderAddIcon } from "../header/icon";
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native";
import { IconButtonWithText } from "./button/icon-button-with-text";
import { useStore } from "../../stores";
import { useSmartNavigation } from "../../navigation";
import Toast from "react-native-toast-message";

export const TransectionActionCard: FunctionComponent<{
  containtStyle?: ViewStyle;
}> = ({ containtStyle }) => {
  const style = useStyle();
  const { chainStore } = useStore();
  const smartNavigation = useSmartNavigation();

  const sectionCardlist = [
    { title: "Receive", icon: <ArrowDownIcon /> },
    { title: "Send", icon: <ArrowUpIcon /> },
    { title: "Swap", icon: <SwapIcon /> },
    { title: "Stake", icon: <StakeIcon /> },
    { title: "Bridge", icon: <BridgeIcon /> },
    { title: "Buy", icon: <HeaderAddIcon size={18} color="white" /> },
  ];

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          switch (item.title) {
            case "Receive":
              return Toast.show({
                type: "error",
                text1: `Recive is working`,
              });

            case "Send":
              return smartNavigation.navigateSmart("SendNew", {
                currency: chainStore.current.stakeCurrency.coinMinimalDenom,
              });

            case "Swap":
              return Toast.show({
                type: "error",
                text1: `Swap is working`,
              });

            case "Stake":
              return Toast.show({
                type: "error",
                text1: `Stake is working`,
              });

            case "Bridge":
              return Toast.show({
                type: "error",
                text1: `Bridge is working`,
              });

            case "Buy":
              return Toast.show({
                type: "error",
                text1: `Buy is working`,
              });
          }
        }}
      >
        <View
          style={style.flatten(["padding-x-8"]) as ViewStyle}
          key={item.title.toLowerCase()}
        >
          <IconButtonWithText icon={item.icon} text={item.title} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sectionCardlist}
      renderItem={renderItem}
      horizontal={true}
      contentContainerStyle={[
        style.flatten([
          "padding-x-12",
          "justify-between",
          "width-full",
        ]) as ViewStyle,
        containtStyle,
      ]}
      keyExtractor={(item) => item.title}
      showsHorizontalScrollIndicator={false}
    />
  );
};
