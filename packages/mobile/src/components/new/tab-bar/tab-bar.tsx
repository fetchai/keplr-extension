import { CardDivider } from "components/card";
import React, { FunctionComponent, useState } from "react";
import { FlatList, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { BlurButton } from "../button/blur-button";

export const TabBarView: FunctionComponent<{
  listItem: any;
  selected: any;
  setSelected: any;
  blurButton?: boolean;
}> = ({ listItem, selected, setSelected, blurButton = false }) => {
  const [prevSelected, setPrevSelected] = useState(0);

  const style = useStyle();

  const renderItem = ({ item }: any) => {
    const select = selected === item;
    return (
      <BlurButton
        backgroundBlur={select && blurButton}
        text={item}
        borderRadius={blurButton ? 64 : 12}
        textStyle={
          style.flatten(
            ["body3"],
            !blurButton ? [select && "color-indigo-900"] : []
          ) as ViewStyle
        }
        containerStyle={
          style.flatten(
            ["padding-x-26"],
            !blurButton ? [select && "background-color-white"] : []
          ) as ViewStyle
        }
        onPress={() => {
          setSelected(item);
          setPrevSelected(Object.values(listItem).indexOf(item) - 1);
        }}
      />
    );
  };

  const renderSeparator = (item: any) => {
    const select = item.leadingItem === selected;
    const prevSelect =
      Object.values(listItem).indexOf(item.leadingItem) === prevSelected;

    return (
      <View>
        {!select && !prevSelect ? (
          <CardDivider
            vertical={true}
            style={style.flatten(["height-12", "margin-y-10"]) as ViewStyle}
          />
        ) : null}
      </View>
    );
  };

  return (
    <FlatList
      data={Object.values(listItem)}
      renderItem={renderItem}
      horizontal={true}
      extraData={selected}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={[
        style.flatten(["width-full", "justify-between"]) as ViewStyle,
      ]}
      scrollEnabled={false}
    />
  );
};
