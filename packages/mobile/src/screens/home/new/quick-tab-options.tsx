import React, { FunctionComponent } from "react";
import { FlatList, Platform, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
import { observer } from "mobx-react-lite";
import { Gradient } from "components/new/gradient";
import { IconButton } from "components/new/button/icon";
import { ArrowDownIcon } from "components/new/icon/arrow-down";
import { ArrowUpIcon } from "components/new/icon/arrow-up";
import { StakeIcon } from "components/new/icon/stake-icon";
import { NewBridgeIcon } from "components/new/icon/new-bridge-icon";
import { XmarkIcon } from "components/new/icon/xmark";

export enum QuickTabOptions {
  receive,
  send,
  earn,
  bridge,
}

export const QuickTabOption: FunctionComponent<{
  containerStyle?: ViewStyle;
  isOpen: boolean;
  close: () => void;
  onPress: (event: QuickTabOptions) => void;
}> = registerModal(
  observer(({ containerStyle, isOpen, close, onPress }) => {
    const style = useStyle();

    const sectionCardList = [
      {
        id: QuickTabOptions.receive,
        title: "Receive",
        icon: <ArrowDownIcon color={"#000D3D"} />,
      },
      {
        id: QuickTabOptions.send,
        title: "Send",
        icon: <ArrowUpIcon color={"#000D3D"} />,
      },
      {
        id: QuickTabOptions.earn,
        title: "Earn",
        icon: <StakeIcon color={"#000D3D"} />,
      },
      {
        id: QuickTabOptions.bridge,
        title: "Bridge",
        icon: <NewBridgeIcon color={"#000D3D"} />,
      },
    ];

    if (!isOpen) {
      return null;
    }

    const renderItem = ({ item }: any) => {
      return (
        <IconButton
          key={item.title.toLowerCase()}
          icon={item.icon}
          bottomText={item.title}
          iconStyle={
            style.flatten([
              "background-color-white",
              "margin-x-14",
              "margin-bottom-6",
              "padding-15",
            ]) as ViewStyle
          }
          containerStyle={style.flatten(["items-center"])}
          onPress={() => {
            close();
            onPress(item.id);
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
          <View style={style.flatten(["items-center"])}>
            <IconButton
              icon={<XmarkIcon size={12} color={"white"} />}
              blurIntensity={15}
              onPress={close}
              iconStyle={
                style.flatten([
                  "padding-16",
                  "border-width-1",
                  "border-radius-64",
                  "border-color-gray-400",
                ]) as ViewStyle
              }
            />
          </View>
        </View>
      </Gradient>
    );
  }),
  {
    disableSafeArea: true,
  }
);
