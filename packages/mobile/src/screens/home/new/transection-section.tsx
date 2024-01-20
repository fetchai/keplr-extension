import React, { FunctionComponent } from "react";
import { useStyle } from "styles/index";
import { HeaderAddIcon } from "components/header/icon";
import { FlatList, View, ViewStyle } from "react-native";
import { useStore } from "stores/index";
import { useSmartNavigation } from "navigation/smart-navigation";
import Toast from "react-native-toast-message";
import { ArrowDownIcon } from "components/new/icon/arrow-down";
import { ArrowUpIcon } from "components/new/icon/arrow-up";
import { SwapIcon } from "components/new/icon/swap-icon";
import { StakeIcon } from "components/new/icon/stake-icon";
import { BridgeIcon } from "components/new/icon/bridge-icon";
import { IconButton } from "components/new/button/icon";

export const TransectionSection: FunctionComponent<{
  containtStyle?: ViewStyle;
}> = ({ containtStyle }) => {
  const style = useStyle();
  const { chainStore } = useStore();
  const smartNavigation = useSmartNavigation();
  const chainId = chainStore.current.chainId;

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
      <View
        style={style.flatten(["padding-x-8"]) as ViewStyle}
        key={item.title.toLowerCase()}
      >
        <IconButton
          icon={item.icon}
          bottomText={item.title}
          containerStyle={style.flatten(["items-center"])}
          iconStyle={style.flatten(["margin-bottom-6"]) as ViewStyle}
          onPress={() => {
            switch (item.title) {
              case "Receive":
                return smartNavigation.navigateSmart("Receive", {
                  chainId,
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
        />
      </View>
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
