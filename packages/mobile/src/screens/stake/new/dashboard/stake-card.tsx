import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useStyle } from "styles/index";
import { CardDivider } from "components/card";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";
import { useStore } from "stores/index";
import { separateNumericAndDenom } from "utils/format/format";
import { observer } from "mobx-react-lite";

export const StakeCard: FunctionComponent<{
  cardStyle?: ViewStyle;
}> = observer(({ cardStyle }) => {
  const style = useStyle();

  const { chainStore, accountStore, queriesStore, priceStore } = useStore();
  const current = chainStore.current;
  const queries = queriesStore.get(current.chainId);
  const accountInfo = accountStore.getAccount(current.chainId);
  const balanceQuery = queries.queryBalances.getQueryBech32Address(
    accountInfo.bech32Address
  );
  const balanceStakableQuery = balanceQuery.stakable;

  const isNoble =
    ChainIdHelper.parse(chainStore.current.chainId).identifier === "noble";
  const hasUSDC = chainStore.current.currencies.find(
    (currency: AppCurrency) => currency.coinMinimalDenom === "uusdc"
  );

  const stakable = (() => {
    if (isNoble && hasUSDC) {
      return balanceQuery.getBalanceFromCurrency(hasUSDC);
    }

    return balanceStakableQuery.balance;
  })();

  const delegated = queries.cosmos.queryDelegations
    .getQueryBech32Address(accountInfo.bech32Address)
    .total.upperCase(true);

  const unbonding = queries.cosmos.queryUnbondingDelegations
    .getQueryBech32Address(accountInfo.bech32Address)
    .total.upperCase(true);

  const rewards = queries.cosmos.queryRewards.getQueryBech32Address(
    accountInfo.bech32Address
  );

  const stakableReward = rewards.stakableReward;
  const stakedSum = delegated.add(unbonding);
  const stakableBal = stakable
    .shrink(true)
    .maxDecimals(5)
    .trim(true)
    .toString();
  const stakedBal = stakedSum.shrink(true).maxDecimals(5).trim(true).toString();
  const rewardsBal = stakableReward
    .shrink(true)
    .maxDecimals(5)
    .trim(true)
    .toString();

  const { numericPart: stakableBalNumber } =
    separateNumericAndDenom(stakableBal);

  const { numericPart: stakedBalNumber } = separateNumericAndDenom(stakedBal);
  const { numericPart: rewardsBalNumber } = separateNumericAndDenom(rewardsBal);
  const total =
    parseFloat(stakableBalNumber) +
    parseFloat(stakedBalNumber) +
    parseFloat(rewardsBalNumber);

  let stakablePercentage = 0;
  let stakedPercentage = 0;
  let rewardsPercentage = 0;
  if (total > 0) {
    stakablePercentage = (parseFloat(stakableBalNumber) / total) * 100;
    stakedPercentage = (parseFloat(stakedBalNumber) / total) * 100;
    rewardsPercentage = (parseFloat(rewardsBalNumber) / total) * 100;
  }

  const pieData = [
    {
      color: "#F9774B",
      value: rewardsPercentage,
      focused: Math.round(rewardsPercentage) > 0,
    },

    {
      color: "#5F38FB",
      value: stakedPercentage,
      focused:
        Math.round(stakablePercentage) == 0 && Math.round(stakedPercentage) > 0,
    },
    {
      color: "#CFC3FE",
      value: stakablePercentage,
      focused:
        Math.round(stakablePercentage) == 0 &&
        Math.round(stakedPercentage) == 0 &&
        Math.round(stakablePercentage) > 0,
    },
  ];

  const renderLine = (color: string) => {
    return (
      <CardDivider
        vertical={true}
        style={
          [
            style.flatten(["width-4", "border-radius-4"]),
            { backgroundColor: color },
          ] as ViewStyle
        }
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <View style={style.flatten(["flex-3"])}>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#CFC3FE")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text
              style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
            >
              Available
            </Text>
            <Text
              style={style.flatten(["color-white", "subtitle1"]) as ViewStyle}
            >
              {`${parseFloat(stakableBal).toFixed(2)} ${
                stakable.currency.coinDenom
              }`}{" "}
              <Text style={style.flatten(["color-white@60%"]) as ViewStyle}>
                {`(${stakablePercentage.toFixed(2)}%)`}
              </Text>
            </Text>
            {priceStore.calculatePrice(stakable)?.toString() ? (
              <Text
                style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
              >
                {priceStore.calculatePrice(stakable)?.toString()}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#5F38FB")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text
              style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
            >
              Staked
            </Text>
            <Text
              style={style.flatten(["color-white", "subtitle1"]) as ViewStyle}
            >
              {`${parseFloat(stakedBal).toFixed(2)} ${
                stakable.currency.coinDenom
              }`}{" "}
              <Text style={style.flatten(["color-white@60%"]) as ViewStyle}>
                {`(${stakedPercentage.toFixed(2)}%)`}
              </Text>
            </Text>
            {priceStore.calculatePrice(stakedSum)?.toString() ? (
              <Text
                style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
              >
                {priceStore.calculatePrice(stakedSum)?.toString()}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#F9774B")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text
              style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
            >
              Staking rewards
            </Text>
            <Text
              style={style.flatten(["color-white", "subtitle1"]) as ViewStyle}
            >
              {`${parseFloat(rewardsBal).toFixed(2)} ${
                stakable.currency.coinDenom
              }`}{" "}
              <Text style={style.flatten(["color-white@60%"]) as ViewStyle}>
                {`(${rewardsPercentage.toFixed(2)}%)`}
              </Text>
            </Text>
            {priceStore.calculatePrice(stakableReward)?.toString() ? (
              <Text
                style={style.flatten(["color-white@60%", "body3"]) as ViewStyle}
              >
                {priceStore.calculatePrice(stakableReward)?.toString()}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[style.flatten(["border-radius-16"]), cardStyle] as ViewStyle}>
      <View style={style.flatten(["flex-row", "items-center"]) as ViewStyle}>
        {renderLegendComponent()}
        <View style={style.flatten(["flex-2", "margin-right-18"]) as ViewStyle}>
          <PieChart
            data={pieData}
            donut
            sectionAutoFocus
            radius={65}
            innerRadius={40}
            innerCircleColor={"#232B5D"}
            focusOnPress={true}
          />
        </View>
      </View>
    </View>
  );
});
