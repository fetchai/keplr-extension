import React, { useState } from "react";
import style from "./style.module.scss";
import { useStore } from "../../stores";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { useLanguage } from "../../languages";
import { AppCurrency } from "@keplr-wallet/types";
import { observer } from "mobx-react-lite";
import { Tab } from "../../new-components-1/tab";

export const Assets = observer(() => {
  const [activeTab, setActiveTab] = useState("Your Balance");
  const tabNames = ["Your Balance", "Available", "Staked"];
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const { chainStore, accountStore, queriesStore, priceStore } = useStore();

  const language = useLanguage();

  const fiatCurrency = language.fiatCurrency;

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

  const isEvm = chainStore.current.features?.includes("evm") ?? false;

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
  const total = stakable.add(stakedSum).add(stakableReward);
  const totalPrice = priceStore.calculatePrice(total, fiatCurrency);
  return (
    <div className={style["balance-field"]}>
      <Tab
        tabNames={tabNames}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {activeTab === "Your Balance" && (
        <div className={style["balance"]}>
          {" "}
          {totalPrice
            ? totalPrice.toString()
            : total.shrink(true).trim(true).maxDecimals(6).toString()}
          {isEvm &&
            totalPrice &&
            activeTab === "Your Balance" &&
            stakable.shrink(true).maxDecimals(6).toString()}
        </div>
      )}
      {activeTab === "Available" && !isEvm && (
        <div className={style["balance"]}>
          {!isEvm && stakable.shrink(true).maxDecimals(6).toString()}
        </div>
      )}
      {activeTab === "Staked" && !isEvm && (
        <div className={style["balance"]}>
          {!isEvm && stakedSum.shrink(true).maxDecimals(6).toString()}
        </div>
      )}
    </div>
  );
});
