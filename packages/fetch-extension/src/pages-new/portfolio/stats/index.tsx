import React from "react";
import style from "../style.module.scss";
import { Doughnut } from "react-chartjs-2";
import { separateNumericAndDenom } from "@utils/format";
import { useStore } from "../../../stores";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";

export const Stats = () => {
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
  // const total = stakable.add(stakedSum).add(stakableReward);

  // const totalBalance = total.toString();
  const stakableBal = stakable.toString();
  const stakedBal = stakedSum.toString();
  const rewardsBal = stakableReward.toString();

  const { numericPart: stakableBalNumber } =
    separateNumericAndDenom(stakableBal);
  // const { numericPart: totalBalanceNumber } =
  //   separateNumericAndDenom(totalBalance);
  const { numericPart: stakedBalNumber } = separateNumericAndDenom(stakedBal);
  const { numericPart: rewardsBalNumber } = separateNumericAndDenom(rewardsBal);

  const doughnutData = {
    labels: ["Balance", "Staked", "Rewards"],
    datasets: [
      {
        data: [
          parseFloat(stakableBalNumber),
          parseFloat(stakedBalNumber),
          parseFloat(rewardsBalNumber),
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#4CAF50"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  return (
    <div className={style["card"]}>
      <div>STAKING</div>
      <div className={style["doughnut-graph"]}>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};
