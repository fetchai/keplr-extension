import { HeaderLayout } from "@layouts-v2/header-layout";
import React, { useState } from "react";
import { useStore } from "../../stores";
import { useNavigate } from "react-router";
import style from "./style.module.scss";
import { LineGraphView } from "../../components-v2/line-graph";
import { ButtonV2 } from "@components-v2/buttons/button";
import { useLanguage } from "../../languages";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { AppCurrency } from "@keplr-wallet/types";
import { Activity } from "./activity";

export const AssetView = () => {
  const { chainStore, accountStore, queriesStore, priceStore } = useStore();
  const [_assetValues, setAssetValues] = useState();
  const navigate = useNavigate();
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

  const separateNumericAndDenom = (value: string) => {
    const [numericPart, denomPart] = value.split(" ");
    return { numericPart, denomPart };
  };
  const { numericPart: totalNumber, denomPart: totalDenom } =
    separateNumericAndDenom(
      total.shrink(true).trim(true).maxDecimals(6).toString()
    );
  return (
    <HeaderLayout showTopMenu={true} onBackButton={() => navigate(-1)}>
      <div className={style["asset-info"]}>
        <img src="" alt="F" />
        <div className={style["name"]}>{current.chainName}</div>
        <div className={style["price-in-usd"]}>
          {totalPrice && `${totalPrice.toString()} USD`}
        </div>
      </div>
      <LineGraphView tokenName="fetch-ai" setTokenState={setAssetValues} />
      <div className={style["balances"]}>
        <div className={style["your-bal"]}> YOUR BALANCE</div>
        <div>
          {isEvm ? (
            <div className={style["balance-field"]}>
              <div className={style["balance"]}>
                {totalNumber} <div className={style["denom"]}>{totalDenom}</div>
              </div>
              <div className={style["inUsd"]}>
                {totalPrice && ` ${totalPrice.toString()} USD`}
              </div>
            </div>
          ) : (
            <div className={style["balance-field"]}>
              <div className={style["balance"]}>
                {totalNumber} <div className={style["denom"]}>{totalDenom}</div>
              </div>
              <div className={style["inUsd"]}>
                {totalPrice
                  ? ` ${totalPrice.toString()} USD`
                  : ` ${total
                      .shrink(true)
                      .trim(true)
                      .maxDecimals(6)
                      .toString()} USD`}
              </div>
            </div>
          )}
        </div>
        <div></div>
      </div>
      <div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ButtonV2
            styleProps={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              justifyContent: "center",
            }}
            onClick={() => navigate("/receive")}
            text={"Recieve"}
          >
            <img
              className={style["img"]}
              src={require("@assets/svg/wireframe/arrow-down-gradient.svg")}
              alt=""
            />
          </ButtonV2>
          <ButtonV2
            styleProps={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              justifyContent: "center",
            }}
            onClick={() => navigate("/send")}
            text={"Send"}
          >
            <img
              className={style["img"]}
              src={require("@assets/svg/wireframe/arrow-up-gradient.svg")}
              alt=""
            />
          </ButtonV2>
        </div>
        <ButtonV2
          styleProps={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: "center",
            marginBottom:"48px"
          }}
          onClick={() => navigate("/stake")}
          text={"Earn"}
        >
          <img
            className={style["img"]}
            src={require("@assets/svg/wireframe/earn.svg")}
            alt=""
          />
        </ButtonV2>
      </div>
      <Activity />
    </HeaderLayout>
  );
};
