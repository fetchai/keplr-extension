import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { useStyle } from "styles/index";
import { CardDivider } from "components/card";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";
import { useStore } from "stores/index";
import { separateNumericAndDenom } from "utils/format/format";

export const StakingCard: FunctionComponent<{ cardStyle?: ViewStyle }> = ({
  cardStyle,
}) => {
  const style = useStyle();
  const { chainStore, accountStore, queriesStore } = useStore();
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
  const stakableBal = stakable.toString();
  const stakedBal = stakedSum.toString();
  const rewardsBal = stakableReward.toString();

  const { numericPart: stakableBalNumber } =
    separateNumericAndDenom(stakableBal);

  const { numericPart: stakedBalNumber } = separateNumericAndDenom(stakedBal);
  const { numericPart: rewardsBalNumber } = separateNumericAndDenom(rewardsBal);
  const total =
    parseFloat(stakableBalNumber) +
    parseFloat(stakedBalNumber) +
    parseFloat(rewardsBalNumber);

  const stakablePercentage = (parseFloat(stakableBalNumber) / total) * 100;
  const stakedPercentage = (parseFloat(stakedBalNumber) / total) * 100;
  const rewardsPercentage = (parseFloat(rewardsBalNumber) / total) * 100;

  const pieData = [
    {
      color: "#F9774B",
      value: stakablePercentage,
      focused: Math.round(stakablePercentage) > 0,
    },
    {
      color: "#5F38FB",
      value: stakedPercentage,
      focused:
        Math.round(stakablePercentage) == 0 && Math.round(stakedPercentage) > 0,
    },
    {
      color: "#CFC3FE",
      value: rewardsPercentage,
      focused:
        Math.round(stakablePercentage) == 0 &&
        Math.round(stakedPercentage) == 0 &&
        Math.round(rewardsPercentage) > 0,
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
      <View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#F9774B")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Available
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {parseFloat(stakableBal).toFixed(4)} FET (
              {stakablePercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#5F38FB")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Staked
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {parseFloat(stakedBal).toFixed(4)} FET (
              {stakedPercentage.toFixed(1)}
              %)
            </Text>
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#CFC3FE")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Staking rewards
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {parseFloat(rewardsBal).toFixed(4)} FET (
              {rewardsPercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BlurBackground
      blurIntensity={10}
      containerStyle={
        [
          style.flatten(["padding-18", "border-radius-16"]),
          cardStyle,
        ] as ViewStyle
      }
    >
      <Text
        style={
          style.flatten(["color-white", "h6", "margin-bottom-20"]) as ViewStyle
        }
      >
        STAKING
      </Text>
      <View
        style={
          style.flatten([
            "flex-row",
            // "justify-between",
            "items-center",
          ]) as ViewStyle
        }
      >
        {renderLegendComponent()}
        <View>
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
    </BlurBackground>
  );
};
