import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Platform, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TokenBalanceSection } from "screens/portfolio/token-detail/token-balance-section";
import { TokenGraphSection } from "screens/portfolio/token-detail/token-graph-section";
import { IconButton } from "components/new/button/icon";
import { HeaderBackButtonIcon } from "components/header/icon";
import { useStore } from "stores/index";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { separateNumericAndDenom } from "utils/format/format";
import { getTokenIcon } from "utils/get-token-icon";
import FastImage from "react-native-fast-image";
import { VectorCharacter } from "components/vector-character";

export const TokenDetail: FunctionComponent = observer(() => {
  const size = 56;
  const [tokenIcon, setTokenIcon] = useState<string>("");

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          tokenString: string;
          tokenBalanceString: string;
        }
      >,
      string
    >
  >();

  const tokenString = route.params.tokenString;
  const tokenBalanceString = route.params.tokenBalanceString;

  const decodedBalancesString = JSON.parse(
    decodeURIComponent(tokenBalanceString)
  );
  const balances = decodedBalancesString;

  const decodedTokenInfo = JSON.parse(decodeURIComponent(tokenString));
  const tokenInfo = decodedTokenInfo;

  const style = useStyle();
  const safeAreaInsets = useSafeAreaInsets();

  const { chainStore, accountStore, queriesStore } = useStore();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const account = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);

  const queryStakable = queries.queryBalances.getQueryBech32Address(
    account.bech32Address
  ).stakable;
  const stakable = queryStakable.balance;

  const queryDelegated = queries.cosmos.queryDelegations.getQueryBech32Address(
    account.bech32Address
  );
  const delegated = queryDelegated.total;

  const queryUnbonding =
    queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(
      account.bech32Address
    );
  const unbonding = queryUnbonding.total;
  const stakedSum = delegated.add(unbonding);
  const total = stakable.add(stakedSum);
  const { numericPart: totalNumber, denomPart: totalDenom } =
    separateNumericAndDenom(
      total.shrink(true).trim(true).maxDecimals(6).toString()
    );

  useEffect(() => {
    if (tokenInfo?.coinGeckoId) {
      const fetchTokenImage = async () => {
        const tokenImage = await getTokenIcon(tokenInfo?.coinGeckoId);
        setTokenIcon(tokenImage);
      };
      fetchTokenImage();
    } else {
      setTokenIcon("");
    }
  }, [tokenInfo?.coinGeckoId]);

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
      }}
    >
      <View style={style.flatten(["margin-x-20"]) as ViewStyle}>
        <IconButton
          borderRadius={32}
          icon={<HeaderBackButtonIcon color="white" size={21} />}
          backgroundBlur={false}
          onPress={() => navigation.goBack()}
          iconStyle={
            style.flatten([
              "width-54",
              "border-width-1",
              "border-color-gray-300",
              "padding-x-14",
              "padding-y-6",
              "justify-center",
              "items-center",
              "margin-y-10",
            ]) as ViewStyle
          }
        />
        <View style={style.flatten(["items-center"])}>
          {tokenIcon ? (
            <View
              style={
                style.flatten([
                  `width-${size}`,
                  `height-${size}`,
                  "items-center",
                  "justify-center",
                  "border-radius-64",
                ]) as ViewStyle
              }
            >
              <FastImage
                style={{
                  width: size,
                  height: size,
                  borderRadius: 50,
                }}
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: tokenIcon,
                }}
              />
            </View>
          ) : (
            <IconButton
              icon={
                <VectorCharacter
                  char={tokenInfo.coinDenom[0]}
                  height={Math.floor(size * 0.35)}
                  color="white"
                />
              }
              iconStyle={
                style.flatten([
                  `width-${size}`,
                  `height-${size}`,
                  "items-center",
                  "justify-center",
                ]) as ViewStyle
              }
            />
          )}
        </View>
        <Text
          style={
            style.flatten([
              "color-gray-200",
              "h4",
              "margin-y-4",
              "text-center",
            ]) as ViewStyle
          }
        >
          {tokenInfo.coinDenom}
        </Text>
        {balances.balanceInUsd ? (
          <View
            style={
              style.flatten([
                "flex-row",
                "margin-y-4",
                "justify-center",
              ]) as ViewStyle
            }
          >
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {balances.balanceInUsd}
            </Text>
          </View>
        ) : null}
      </View>
      {tokenInfo.coinGeckoId ? (
        <TokenGraphSection
          totalNumber={totalNumber}
          totalDenom={totalDenom}
          tokenName={tokenInfo.coinGeckoId}
        />
      ) : null}
      <TokenBalanceSection
        totalNumber={balances.balance}
        totalDenom={balances.totalDenom}
        totalPrice={balances.balanceInUsd}
      />
    </PageWithScrollViewInBottomTabView>
  );
});
