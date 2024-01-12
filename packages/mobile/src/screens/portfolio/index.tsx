import React, { FunctionComponent, useRef, useState } from "react";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { observer } from "mobx-react-lite";
import { StakingCard } from "components/new/staking/staking-card";
import {
  FlatList,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconView } from "components/new/button/icon";
import { useStyle } from "styles/index";
import { HeaderBackButtonIcon } from "components/header/icon";
import { BlurButton } from "components/new/button/blur-button";
import { CardDivider } from "components/card";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { NativeTokensSection } from "screens/portfolio/native-tokens-section";
import { TokensSection } from "screens/portfolio/tokens-section";
import { AssetsScreen } from "screens/assets/assets";

enum AssertsSectionEnum {
  Tokens = "Tokens",
  NTFs = "NTFs",
  Stats = "Stats",
}

export const PortfolioScreen: FunctionComponent = observer(() => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const style = useStyle();
  const safeAreaInsets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedId, setSelectedId] = useState(AssertsSectionEnum.Tokens);
  const [prevSelectedId, setPrevSelectedId] = useState(0);
  const [tokenState] = useState({});
  const renderItem = ({ item }: any) => {
    const selected = selectedId === item;
    return (
      <BlurButton
        backgroundBlur={selected}
        text={item}
        borderRadius={32}
        textStyle={style.flatten(["body3"]) as ViewStyle}
        containerStyle={style.flatten(["padding-x-24"]) as ViewStyle}
        onPress={() => {
          return (
            setSelectedId(item),
            setPrevSelectedId(
              Object.values(AssertsSectionEnum).indexOf(item) - 1
            )
          );
        }}
      />
    );
  };

  const renderSeparator = (item: any) => {
    const selected = item.leadingItem === selectedId;
    const prevSelected =
      Object.values(AssertsSectionEnum).indexOf(item.leadingItem) ===
      prevSelectedId;

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
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
      }}
      ref={scrollViewRef}
    >
      <View style={style.flatten(["margin-x-20"]) as ViewStyle}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <IconView
            borderRadius={32}
            img={<HeaderBackButtonIcon color="white" size={21} />}
            backgroundBlur={false}
            iconStyle={
              style.flatten([
                "width-58",
                "border-width-1",
                "border-color-gray-300",
                "padding-x-16",
                "padding-y-6",
                "justify-center",
                "margin-y-10",
              ]) as ViewStyle
            }
          />
        </TouchableOpacity>
        <Text
          style={
            style.flatten(["h1", "color-white", "margin-y-10"]) as ViewStyle
          }
        >
          Portfolio
        </Text>
        <FlatList
          data={Object.values(AssertsSectionEnum)}
          renderItem={renderItem}
          horizontal={true}
          extraData={selectedId}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={[
            style.flatten([
              "justify-between",
              "width-full",
              "margin-y-10",
            ]) as ViewStyle,
          ]}
        />
        {selectedId === AssertsSectionEnum.Tokens && (
          <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
            <NativeTokensSection />
            <TokensSection />
          </View>
        )}
        {selectedId === AssertsSectionEnum.NTFs && (
          <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
            <AssetsScreen tokenState={tokenState} />
          </View>
        )}

        {selectedId === AssertsSectionEnum.Stats && (
          <StakingCard
            cardStyle={style.flatten(["margin-y-20"]) as ViewStyle}
          />
        )}
      </View>
    </PageWithScrollViewInBottomTabView>
  );
});
