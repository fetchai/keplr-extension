import React from "react";
import { Doughnut } from "react-chartjs-2";
import { separateNumericAndDenom } from "@utils/format";

import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";
import style from "../style.module.scss";

import { useStore } from "../../../stores";
import { EmptyStake } from "./empty-stake";
import { MyStakes } from "./my-stake/my-stakes";
import { observer } from "mobx-react-lite";

export const Dashboard = observer(() => {
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

  const stakablePercentage = total
    ? (parseFloat(stakableBalNumber) / total) * 100
    : 0;
  const stakedPercentage = total
    ? (parseFloat(stakedBalNumber) / total) * 100
    : 0;
  const rewardsPercentage = total
    ? (parseFloat(rewardsBalNumber) / total) * 100
    : 0;

  const doughnutData = {
    labels: ["Balance", "Staked", "Rewards"],
    datasets: [
      {
        data: [
          parseFloat(stakableBalNumber),
          parseFloat(stakedBalNumber),
          parseFloat(rewardsBalNumber),
        ],
        backgroundColor: ["#CFC3FE", "#5F38FB", "#F9774B"],
        hoverBackgroundColor: ["#CFC3FE", "#5F38FB", "#F9774B"],
        borderColor: "transparent",
      },
    ],
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  };
  return (
    <div className={style["dashboard"]}>
      <div className={style["stake-container"]}>
        <div className={style["legends"]}>
          <div className={style["legend"]}>
            <img
              src={
                priceStore.calculatePrice(stakable)?.toString()
                  ? require("@assets/svg/wireframe/legend-light-purple-long.svg")
                  : require("@assets/svg/wireframe/legend-light-purple.svg")
              }
              alt=""
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <div className={style["label"]}>Available</div>
              <div className={style["value"]}>
                {parseFloat(stakableBal).toFixed(4)} FET{" "}
                <span className={style["label"]}>
                  ({stakablePercentage.toFixed(1)}%)
                </span>
              </div>
              {priceStore.calculatePrice(stakable)?.toString() ? (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {priceStore.calculatePrice(stakable)?.toString()}
                </div>
              ) : null}
            </div>
          </div>
          <div className={style["legend"]}>
            <img
              src={
                priceStore.calculatePrice(stakedSum)?.toString()
                  ? require("@assets/svg/wireframe/legend-purple-long.svg")
                  : require("@assets/svg/wireframe/legend-purple.svg")
              }
              alt=""
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <div className={style["label"]}>Staked</div>
              <div className={style["value"]}>
                {parseFloat(stakedBal).toFixed(4)} FET{" "}
                <span className={style["label"]}>
                  ({stakedPercentage.toFixed(1)}
                  %)
                </span>
              </div>
              {priceStore.calculatePrice(stakedSum)?.toString() ? (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {priceStore.calculatePrice(stakedSum)?.toString()}
                </div>
              ) : null}
            </div>
          </div>
          <div className={style["legend"]}>
            <img
              src={
                priceStore.calculatePrice(stakable)?.toString()
                  ? require("@assets/svg/wireframe/legend-orange-long.svg")
                  : require("@assets/svg/wireframe/legend-orange.svg")
              }
              alt=""
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <div className={style["label"]}>Staking rewards</div>
              <div className={style["value"]}>
                {parseFloat(rewardsBal).toFixed(4)} FET{" "}
                <span className={style["label"]}>
                  ({rewardsPercentage.toFixed(1)}%)
                </span>
              </div>
              {priceStore.calculatePrice(stakable)?.toString() ? (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {priceStore.calculatePrice(stakable)?.toString()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={style["doughnut-graph"]}>
          <Doughnut data={doughnutData} options={doughnutData.options} />
        </div>
      </div>

      {stakedPercentage === 0 ? (
        <EmptyStake />
      ) : (
        <MyStakes rewards={rewards} accountInfo={accountInfo} />
      )}
    </div>
  );
});
