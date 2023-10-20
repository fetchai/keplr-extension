import React, { useEffect } from "react";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
interface BalanceProps {
  fromToken: any;
  tokenBal: any;
  setTokenBal: any;
}

export const TokenBalances: React.FC<BalanceProps> = observer(
  ({ fromToken, tokenBal, setTokenBal }) => {
    const { queriesStore, chainStore, accountStore } = useStore();
    const current = chainStore.current;
    const accountInfo = accountStore.getAccount(current.chainId);
    const query = queriesStore
      .get(current.chainId)
      .queryBalances.getQueryBech32Address(accountInfo.bech32Address);
    useEffect(() => {
      const queryBalances = query.balances;
      const queryBalance = queryBalances.find(
        (bal) => fromToken?.assetSymbol == bal.currency.coinDenom
      );
      if (queryBalance) {
        setTokenBal(queryBalance.balance.trim(true).maxDecimals(6).toString());
      } else {
        const accountQueryBalances = queriesStore
          .get(current.chainId)
          .queryBalances.getQueryBech32Address(
            accountInfo.bech32Address
          ).nonNativeBalances;
        const queryBalance = accountQueryBalances.find(
          (bal) => fromToken?.assetSymbol == bal.currency.coinDenom
        );
        setTokenBal(queryBalance?.balance.trim(true).maxDecimals(6).toString());
      }
    }, [fromToken, current.chainId]);
    return <div>Token Bal : {tokenBal ? tokenBal : "0.0"}</div>;
  }
);
