import React, { FunctionComponent, useRef } from "react";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { RectButton } from "components/rect-button";
import { CheckIcon } from "components/new/icon/check";
import { CardModal } from "modals/card";

export const SelectorModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  items: {
    label: string;
    key: string;
  }[];
  maxItemsToShow?: number;
  selectedKey: string | undefined;
  setSelectedKey: (key: string | undefined) => void;
  modalPersistent?: boolean;
}> = ({
  isOpen,
  close,
  items,
  selectedKey,
  setSelectedKey,
  maxItemsToShow,
  modalPersistent,
}) => {
  const style = useStyle();

  const renderBall = (selected: boolean) => {
    if (selected) {
      return (
        <View
          style={
            style.flatten([
              "width-24",
              "height-24",
              "border-radius-32",
              "background-color-white",
              "dark:background-color-blue-300",
              "items-center",
              "justify-center",
            ]) as ViewStyle
          }
        >
          {/* <View
                style={
                  style.flatten([
                    "width-12",
                    "height-12",
                    "border-radius-32",
                    "background-color-indigo-800",
                  ]) as ViewStyle
                }
              /> */}
          <CheckIcon color="#270E8D" />
        </View>
      );
    } else {
      return (
        <View
          style={
            style.flatten([
              "width-24",
              "height-24",
              "border-radius-32",
              "background-color-indigo-900",
              "dark:background-color-platinum-600",
              "border-width-1",
              "border-color-white@60%",
              "dark:border-color-platinum-300",
            ]) as ViewStyle
          }
        />
      );
    }
  };

  const scrollViewRef = useRef<ScrollView | null>(null);
  const initOnce = useRef<boolean>(false);

  const onInit = () => {
    if (!initOnce.current) {
      if (scrollViewRef.current) {
        scrollViewRef.current.flashScrollIndicators();

        if (maxItemsToShow) {
          const selectedIndex = items.findIndex(
            (item) => item.key === selectedKey
          );

          if (selectedIndex) {
            const scrollViewHeight = maxItemsToShow * 64;

            scrollViewRef.current.scrollTo({
              y: selectedIndex * 64 - scrollViewHeight / 2 + 32,
              animated: false,
            });
          }
        }

        initOnce.current = true;
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <CardModal isOpen={isOpen} close={close} showCloseButton={false}>
      <ScrollView
        style={{
          maxHeight: maxItemsToShow ? 64 * maxItemsToShow : undefined,
        }}
        ref={scrollViewRef}
        persistentScrollbar={true}
        onLayout={onInit}
        indicatorStyle={style.theme === "dark" ? "white" : "black"}
      >
        {items.map((item) => {
          return (
            <RectButton
              key={item.key}
              style={
                style.flatten(
                  [
                    "height-50",
                    "padding-x-24",
                    "flex-row",
                    "items-center",
                    "justify-between",
                    "border-radius-12",
                  ],
                  [item.key === selectedKey && "background-color-indigo"]
                ) as ViewStyle
              }
              onPress={() => {
                setSelectedKey(item.key);
                if (!modalPersistent) {
                  close();
                }
              }}
            >
              <Text
                style={style.flatten(["subtitle2", "color-white"]) as ViewStyle}
              >
                {item.label}
              </Text>
              {renderBall(item.key === selectedKey)}
            </RectButton>
          );
        })}
      </ScrollView>
    </CardModal>
  );
};
