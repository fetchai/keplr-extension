import React, { FunctionComponent, useRef, useState } from "react";
import {PageWithScrollViewInBottomTabView} from "components/page";
import { observer } from "mobx-react-lite";
import {StakingCard} from "components/new/staking/staking-card";
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
import {IconView} from "components/new/button/icon";
import {useStyle} from "styles/index";
import {HeaderBackButtonIcon} from "components/header/icon";
import {BlurButton} from "components/new/button/blur-button";
import {CardDivider} from "components/card";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import {useStore} from "stores/index";
import {TokenCardView} from "components/new/card-view/token-card-view";

export const PortfolioScreen: FunctionComponent = observer(() => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const style = useStyle();
  const safeAreaInsets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [prevSelectedId, setPrevSelectedId] = useState<string>("0");

  const { chainStore, queriesStore, accountStore } = useStore();

  const queryBalances = queriesStore
    .get(chainStore.current.chainId)
    .queryBalances.getQueryBech32Address(
      accountStore.getAccount(chainStore.current.chainId).bech32Address
    );

  // TODO: Add sorting rule
  const tokens = queryBalances.positiveNativeUnstakables
    .concat(queryBalances.nonNativeBalances)
    .slice(0, 2);

  const assertsSectionList = [
    { id: "1", title: "Tokens" },
    { id: "2", title: "NTFs" },
    { id: "3", title: "Stats" },
  ];

  const renderItem = ({ item }: any) => {
    const selected = selectedId === item.id ? true : false;
    return (
      <BlurButton
        backgroundBlur={selected}
        text={item.title}
        borderRadius={32}
        textStyle={style.flatten(["body3"]) as ViewStyle}
        containerStyle={style.flatten(["padding-x-24"]) as ViewStyle}
        onPress={() => {
          return (
            setSelectedId(item.id),
            setPrevSelectedId((Number(item.id) - 1).toString())
          );
        }}
      />
    );
  };

  const renderSeparator = (item: any) => {
    const selected = item.leadingItem.id === selectedId ? true : false;
    const prevSelected = item.leadingItem.id === prevSelectedId ? true : false;
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
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
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
          data={assertsSectionList}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item) => item.id}
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
        {selectedId === "1" ? (
          tokens.length > 0 ? (
            <View style={style.flatten(["margin-y-20"]) as ViewStyle}>
              {tokens.map((token) => {
                return (
                  <TokenCardView
                    key={token.currency.coinMinimalDenom}
                    chainInfo={chainStore.current}
                    balance={token.balance}
                  />
                );
              })}
            </View>
          ) : null
        ) : selectedId === "2" ? (
          console.log("select NTFs")
        ) : (
          <StakingCard
            cardStyle={style.flatten(["margin-y-20"]) as ViewStyle}
          />
        )}
      </View>
    </PageWithScrollViewInBottomTabView>
  );
});
