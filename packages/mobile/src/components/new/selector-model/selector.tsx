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
          style={style.flatten(["items-center", "justify-center"]) as ViewStyle}
        >
          <CheckIcon />
        </View>
      );
    } else {
      return null;
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
                    "padding-x-18",
                    "padding-y-16",
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
                style={style.flatten(["body3", "color-white"]) as ViewStyle}
              >
                {item.label.trim()}
              </Text>
              {renderBall(item.key === selectedKey)}
            </RectButton>
          );
        })}
      </ScrollView>
    </CardModal>
  );
};
