import React, { useState } from "react";
import style from "./style.module.scss";
import { useStore } from "../../stores";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { useLanguage } from "../../languages";
import { AppCurrency } from "@keplr-wallet/types";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useNotification } from "@components/notification";
// import { TabsPanel } from "../../new-components-1/tabsPanel";
import { Button } from "reactstrap";
import { ButtonGradient } from "../../new-components-1/button-gradient";

export const Balances = observer(() => {
  const { chainStore, accountStore, queriesStore, priceStore, analyticsStore } =
    useStore();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const notification = useNotification();
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
  const convertToUsd = (currency: any) => {
    const value = priceStore.calculatePrice(currency, fiatCurrency);
    const inUsd = value && value.shrink(true).maxDecimals(6).toString();
    return inUsd;
  };
  // withdraw rewards
  const withdrawAllRewards = async () => {
    if (
      accountInfo.isReadyToSendMsgs &&
      chainStore.current.walletUrlForStaking
    ) {
      try {
        // When the user delegated too many validators,
        // it can't be sent to withdraw rewards from all validators due to the block gas limit.
        // So, to prevent this problem, just send the msgs up to 8.
        await accountInfo.cosmos.sendWithdrawDelegationRewardMsgs(
          rewards.getDescendingPendingRewardValidatorAddresses(8),
          "",
          undefined,
          undefined,
          {
            onBroadcasted: () => {
              analyticsStore.logEvent("Claim reward tx broadcasted", {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
              });
            },
          }
        );

        navigate("/", { replace: true });
      } catch (e: any) {
        navigate("/", { replace: true });
        notification.push({
          type: "warning",
          placement: "top-center",
          duration: 5,
          content: `Fail to withdraw rewards: ${e.message}`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      }
    }
  };

  const separateNumericAndDenom = (value: string) => {
    const [numericPart, denomPart] = value.split(" ");
    return { numericPart, denomPart };
  };
  const { numericPart: totalNumber, denomPart: totalDenom } =
    separateNumericAndDenom(
      total.shrink(true).trim(true).maxDecimals(6).toString()
    );
  const { numericPart: availableNumber, denomPart: availableDenom } =
    separateNumericAndDenom(stakable.shrink(true).maxDecimals(6).toString());
  const { numericPart: stakableNumber, denomPart: stakableDenom } =
    separateNumericAndDenom(stakedSum.shrink(true).maxDecimals(6).toString());
  const { numericPart: rewardNumber, denomPart: rewardDenom } =
    separateNumericAndDenom(
      stakableReward.shrink(true).maxDecimals(6).toString()
    );
  return (
    <div className={style["balance-field"]}>
      {isEvm ? (
        <div className={style["balance"]}>
          {totalNumber} <span className={style["inUsd"]}>{totalDenom}</span>
          <div className={style["inUsd"]}>
            {totalPrice && totalPrice.toString()}
          </div>
        </div>
      ) : (
        <div className={style["balance"]}>
          {totalNumber} <span className={style["inUsd"]}>{totalDenom}</span>
          <div className={style["inUsd"]}>
            {totalPrice
              ? totalPrice.toString()
              : total.shrink(true).trim(true).maxDecimals(6).toString()}
          </div>
        </div>
      )}
      {!isEvm && (
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className={style["view-details"]}
        >
          {isVisible ? "Hide details" : "View details"}
        </Button>
      )}
      {isVisible && !isEvm && (
        <div>
          <img
            style={{ margin: "6px 0px", width: "100%" }}
            src={require("@assets/svg/wireframe/Line.svg")}
            alt=""
          />
          <div>
            <div style={{ color: " rgba(255, 255, 255, 0.60)" }}>
              Available balance
            </div>
            <div className={style["balance"]}>
              {availableNumber}
              <span className={style["inUsd"]}> {availableDenom}</span>
              <div className={style["inUsd"]}>{convertToUsd(stakable)} USD</div>
            </div>
          </div>
          <img
            style={{ margin: "6px 0px", width: "100%" }}
            src={require("@assets/svg/wireframe/Line.svg")}
            alt=""
          />
          <div>
            <div style={{ color: " rgba(255, 255, 255, 0.60)" }}>
              {" "}
              Staked amount
            </div>
            <div className={style["balance"]}>
              {stakableNumber}{" "}
              <span className={style["inUsd"]}>{stakableDenom}</span>
              <div className={style["inUsd"]}>
                {convertToUsd(stakedSum)} USD
              </div>
            </div>
          </div>
          <img
            style={{ margin: "6px 0px", width: "100%" }}
            src={require("@assets/svg/wireframe/Line.svg")}
            alt=""
          />
          <div>
            <div style={{ color: " rgba(255, 255, 255, 0.60)" }}>
              {" "}
              Staking reward
            </div>
            <div className={style["reward"]}>
              {rewardNumber}{" "}
              <span className={style["inUsd"]}>{rewardDenom}</span>
              <div className={style["inUsd"]}>
                {convertToUsd(stakableReward)} USD
              </div>
            </div>
          </div>
          <ButtonGradient
            disabled={rewardNumber == "0"}
            data-loading={accountInfo.isSendingMsg === "withdrawRewards"}
            text="Claim rewards"
            gradientText=""
            onClick={withdrawAllRewards}
          />
        </div>
      )}
    </div>
  );
});
