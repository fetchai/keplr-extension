import React, { ReactElement, useState } from "react";
import { PageWithViewInBottomTabView } from "components/page";
import { Platform, ScrollView, Text, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChipButton } from "components/new/chip";
import { FilterIcon } from "components/new/icon/filter-icon";

import { ChatSection } from "screens/inbox/chat-section";
import { ActivityNativeTab } from "screens/activity/activity-transaction";
export interface FilterItem {
  icon: ReactElement;
  isSelected: boolean;
  title: string;
  value: string;
}

enum ActivityEnum {
  Transactions = "Transactions",
  GovProposals = "Gov Proposals",
}

export const ActivityScreen = () => {
  const style = useStyle();
  const [selectedId, _setSelectedId] = useState(ActivityEnum.Transactions);
  const safeAreaInsets = useSafeAreaInsets();
  const [latestBlock, _setLatestBlock] = useState<string>();
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <PageWithViewInBottomTabView
      backgroundMode={"image"}
      style={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
      }}
    >
      <View style={style.flatten(["items-end", "margin-x-6"]) as ViewStyle}>
        <ChipButton
          text="Filter"
          icon={<FilterIcon />}
          containerStyle={
            style.flatten([
              "border-width-1",
              "border-color-gray-300",
              "width-90",
            ]) as ViewStyle
          }
          backgroundBlur={false}
          onPress={() => setIsOpenModal(true)}
        />
      </View>
      <Text
        style={
          style.flatten([
            "h1",
            "color-white",
            "margin-x-18",
            "margin-y-16",
          ]) as ViewStyle
        }
      >
        Activity
      </Text>
      {/*<TabBarView*/}
      {/*  listItem={ActivityEnum}*/}
      {/*  selected={selectedId}*/}
      {/*  setSelected={setSelectedId}*/}
      {/*  containerStyle={style.flatten(["margin-x-20"]) as ViewStyle}*/}
      {/*/>*/}
      <ScrollView indicatorStyle={"white"}>
        <View style={style.flatten(["margin-y-16"]) as ViewStyle}>
          {selectedId === ActivityEnum.Transactions && (
            <ActivityNativeTab
              latestBlock={latestBlock}
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
            />
          )}
          {selectedId === ActivityEnum.GovProposals && <ChatSection />}
        </View>
      </ScrollView>
    </PageWithViewInBottomTabView>
  );
};
