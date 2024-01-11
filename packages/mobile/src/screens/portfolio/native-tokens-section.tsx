import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "stores/index";
import { TokenCardView } from "components/new/card-view/token-card-view";
import { ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";
import { TokenSymbolUsingChainInfo } from "components/token-symbol/token-symbol-chain";
import { separateNumericAndDenom } from "utils/format/format";

export const NativeTokensSection: FunctionComponent = observer(() => {
  const style = useStyle();

  const { chainStore, queriesStore, accountStore, priceStore } = useStore();
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
  const total = stakable.add(stakedSum).add(stakableReward);
  const { denomPart: totalDenom } = separateNumericAndDenom(
    total.shrink(true).trim(true).maxDecimals(6).toString()
  );
  const totalPrice = priceStore.calculatePrice(total);

  return (
    <TokenCardView
      containerStyle={style.flatten(["margin-y-4"]) as ViewStyle}
      key={total.currency.coinMinimalDenom}
      leadingIcon={
        <TokenSymbolUsingChainInfo
          size={36}
          chainInfo={chainStore.current}
          currency={total.currency}
        />
      }
      title={totalDenom}
      subtitle={total.shrink(true).trim(true).maxDecimals(6).toString()}
      trailingStart={totalPrice ? `${totalPrice.toString()}` : ""}
      trailingEnd={totalPrice ? priceStore.defaultVsCurrency.toUpperCase() : ""}
    />
  );
});
