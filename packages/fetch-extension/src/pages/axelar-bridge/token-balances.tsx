import React, { useEffect } from "react";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import style from "./style.module.scss";
import { formatEthBalance } from "@utils/axl-bridge-utils";

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
      const { balances, nonNativeBalances } = query;
      const queryBalances = balances.concat(nonNativeBalances);
      console.log(queryBalances);
      const queryBalance = queryBalances.find(
        (bal) =>
          fromToken.assetSymbol == bal.currency.coinDenom ||
          fromToken.ibcDenom == bal.currency.coinMinimalDenom
      );
      const balance = queryBalance?.balance
        .trim(true)
        .maxDecimals(6)
        .toString();
      if (balance) {
        balance.includes("-wei")
          ? setTokenBal(formatEthBalance(balance))
          : setTokenBal(balance);
      }
    }, [query, fromToken, setTokenBal]);

    return (
      <div
        style={{ float: "right", fontSize: "small" }}
        className={style["label"]}
      >
        Min Amount :{`${fromToken.minDepositAmt} ${fromToken.assetSymbol}`}
        <div>Token Bal : {tokenBal ? tokenBal : "0.0"}</div>
      </div>
    );
  }
);
