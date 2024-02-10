import React, { FunctionComponent, useRef, useState } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { observer } from "mobx-react-lite";
import { StakingCard } from "components/new/staking/staking-card";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";

import { NativeTokensSection } from "screens/portfolio/native-tokens-section";
import { TokensSection } from "screens/portfolio/tokens-section";
import { TabBarView } from "components/new/tab-bar/tab-bar";

enum AssertsSectionEnum {
  Tokens = "Tokens",
  NTFs = "NTFs",
  Stats = "Stats",
}

export const PortfolioScreen: FunctionComponent = observer(() => {
  const style = useStyle();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedId, setSelectedId] = useState(AssertsSectionEnum.Tokens);

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={style.flatten(["margin-x-20"]) as ViewStyle}
      ref={scrollViewRef}
    >
      <Text
        style={style.flatten(["h1", "color-white", "margin-y-10"]) as ViewStyle}
      >
        Portfolio
      </Text>
      <TabBarView
        listItem={AssertsSectionEnum}
        selected={selectedId}
        setSelected={setSelectedId}
      />
      {selectedId === AssertsSectionEnum.Tokens && (
        <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
          <NativeTokensSection />
          <TokensSection />
        </View>
      )}
      {selectedId === AssertsSectionEnum.Stats && (
        <StakingCard cardStyle={style.flatten(["margin-y-20"]) as ViewStyle} />
      )}
    </PageWithScrollViewInBottomTabView>
  );
});
