import React, { FunctionComponent, useState } from "react";
import { FlatList, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurButton } from "../button/blur-button";
import { CardDivider } from "components/card";

// const tabs = [
//   {
//     index: 0,
//     id: "24H",
//     duration: 1,
//   },
//   {
//     index: 1,
//     id: "1W",
//     duration: 7,
//   },
//   {
//     index: 2,
//     id: "1M",
//     duration: 30,
//   },
//   {
//     index: 3,
//     id: "3M",
//     duration: 90,
//   },
//   {
//     index: 4,
//     id: "1Y",
//     duration: 360,
//   },
//   {
//     index: 5,
//     id: "ALL",
//     duration: 0,
//   },
// ];

export const TabPanel: FunctionComponent<{
  tabs: any[];
  activeTab: any;
  setActiveTab: any;
}> = ({ tabs, activeTab, setActiveTab }) => {
  const style = useStyle();
  const [prevSelectedId, setPrevSelectedId] = useState<any>(tabs[0].index);

  const renderItem = ({ item }: any) => {
    const selected = item.id === activeTab.id ? true : false;
    return (
      <BlurButton
        backgroundBlur={selected}
        text={item.id}
        borderRadius={32}
        textStyle={style.flatten(["body3"]) as ViewStyle}
        containerStyle={style.flatten(["padding-x-4"]) as ViewStyle}
        onPress={() => {
          switch (item.id) {
            case "24H":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);

            case "1W":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);

            case "1M":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);

            case "3M":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);

            case "1Y":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);

            case "ALL":
              return setActiveTab(item), setPrevSelectedId(item.index - 1);
          }
        }}
      />
    );
  };

  const renderSeparator = (item: any) => {
    const selected = item.leadingItem.id === activeTab.id ? true : false;
    const prevSelected =
      item.leadingItem.index === prevSelectedId ? true : false;
    return (
      <View>
        {!selected && !prevSelected ? (
          <CardDivider
            vertical={true}
            style={style.flatten(["height-12", "margin-y-10"]) as ViewStyle}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={style.flatten(["margin-x-16", "margin-y-20"]) as ViewStyle}>
      <FlatList
        data={tabs}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        extraData={activeTab.id}
        contentContainerStyle={[
          style.flatten(["justify-between", "width-full"]) as ViewStyle,
        ]}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};
