import React, { useRef, useState } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { TabBarView } from "components/new/tab-bar/tab-bar";
import { ChatSection } from "screens/inbox/chat-section";
import { NotificationSection } from "screens/inbox/notification-section";

enum InboxEnum {
  Notification = "Notifications",
  Chat = "Chat",
}

export const InboxScreen = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const style = useStyle();
  const [selectedId, setSelectedId] = useState(InboxEnum.Notification);

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={style.flatten(["margin-x-20"]) as ViewStyle}
      ref={scrollViewRef}
    >
      <Text
        style={style.flatten(["h1", "color-white", "margin-y-10"]) as ViewStyle}
      >
        Inbox
      </Text>
      <TabBarView
        listItem={InboxEnum}
        selected={selectedId}
        setSelected={setSelectedId}
      />
      <View
        style={
          style.flatten([
            "margin-y-16",
            "height-full",
            "justify-center",
            "items-center",
          ]) as ViewStyle
        }
      >
        <View style={style.get("flex-1")} />
        {selectedId === InboxEnum.Notification && <NotificationSection />}
        {selectedId === InboxEnum.Chat && <ChatSection />}
        <View style={style.get("flex-2")} />
      </View>
    </PageWithScrollViewInBottomTabView>
  );
};
