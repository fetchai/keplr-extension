import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "styles/index";
import { PageWithScrollViewInBottomTabView } from "components/page";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TokenBalanceSection } from "screens/portfolio/token-detail/token-balance-section";
import { TokenGraphSection } from "screens/portfolio/token-detail/token-graph-section";
import { IconView } from "components/new/button/icon";
import { HeaderBackButtonIcon } from "components/header/icon";
import { useStore } from "stores/index";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { separateNumericAndDenom } from "utils/format/format";

export const TokenDetail: FunctionComponent = observer(() => {
  const style = useStyle();
  const safeAreaInsets = useSafeAreaInsets();

  const { chainStore, accountStore, queriesStore, priceStore } = useStore();
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

  const totalPrice = priceStore.calculatePrice(total);
  const { numericPart: totalNumber, denomPart: totalDenom } =
    separateNumericAndDenom(
      total.shrink(true).trim(true).maxDecimals(6).toString()
    );

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
      }}
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
            {totalPrice &&
              ` ${totalPrice.toString()} ${priceStore.defaultVsCurrency.toUpperCase()}`}
          </Text>
        </View>
      </View>
      <TokenGraphSection totalNumber={totalNumber} totalDenom={totalDenom} />
      <TokenBalanceSection />
    </PageWithScrollViewInBottomTabView>
  );
});
