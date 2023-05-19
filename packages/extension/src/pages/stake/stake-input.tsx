import activeStake from "@assets/icon/activeStake.png";
import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent, useMemo } from "react";
import { useHistory } from "react-router";
import { Button, FormGroup, Input, Label } from "reactstrap";
import "./stake.scss";
import { Staking } from "@keplr-wallet/stores";
import { useStore } from "../../stores";
import { ValidatorDetails } from "./validator-details";

import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import {
  EmptyAmountError,
  IAmountConfig,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError,
  useDelegateTxConfig,
} from "@keplr-wallet/hooks";
import { useNotification } from "@components/notification";

export const StakeInput: FunctionComponent = observer(() => {
  const history = useHistory();
  const validatorAddress = history.location.pathname.split("/")[2];

  const { chainStore, accountStore, queriesStore } = useStore();
  const account = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);

  const sendConfigs = useDelegateTxConfig(
    chainStore,
    queriesStore,
    accountStore,
    chainStore.current.chainId,
    account.bech32Address
  );
  const { amountConfig, memoConfig, feeConfig } = sendConfigs;
  const bondedValidators = queries.cosmos.queryValidators.getQueryStatus(
    Staking.BondStatus.Bonded
  );
  const unbondingValidators = queries.cosmos.queryValidators.getQueryStatus(
    Staking.BondStatus.Unbonding
  );
  const unbondedValidators = queries.cosmos.queryValidators.getQueryStatus(
    Staking.BondStatus.Unbonded
  );
  const queryDelegations = queries.cosmos.queryDelegations.getQueryBech32Address(
    account.bech32Address
  );
  const { validator, amount } = useMemo(() => {
    const amount = queryDelegations.getDelegationTo(validatorAddress);
    const validator =
      bondedValidators.getValidator(validatorAddress) ||
      unbondingValidators.getValidator(validatorAddress) ||
      unbondedValidators.getValidator(validatorAddress);
    const thumbnail =
      bondedValidators.getValidatorThumbnail(validatorAddress) ||
      unbondingValidators.getValidatorThumbnail(validatorAddress) ||
      unbondedValidators.getValidatorThumbnail(validatorAddress);

    return {
      validator,
      thumbnail,
      amount: amount,
    };
  }, [
    queryDelegations,
    validatorAddress,
    bondedValidators,
    unbondingValidators,
    unbondedValidators,
  ]);

  const intl = useIntl();
  const error = amountConfig.error;
  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        case EmptyAmountError:
          // No need to show the error to user.
          return;
        case InvalidNumberAmountError:
          return intl.formatMessage({
            id: "input.amount.error.invalid-number",
          });
        case ZeroAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-zero",
          });
        case NegativeAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-negative",
          });
        case InsufficientAmountError:
          return intl.formatMessage({
            id: "input.amount.error.insufficient",
          });
        default:
          return intl.formatMessage({ id: "input.amount.error.unknown" });
      }
    }
  }, [intl, error]);
  const notification = useNotification();
  const stakeClicked = async () => {
    try {
      await account.cosmos.sendDelegateMsg(
        amountConfig.amount,
        validatorAddress,
        memoConfig.memo,
        feeConfig.toStdFee(),
        undefined,
        {
          onBroadcasted: () => {
            notification.push({
              type: "info",
              placement: "top-center",
              duration: 2,
              content: `Transaction broadcasted`,
              canDelete: true,
              transition: {
                duration: 0.25,
              },
            });
          },
          onFulfill: () => {
            notification.push({
              type: "success",
              placement: "top-center",
              duration: 5,
              content: `Transaction Completed`,
              canDelete: true,
              transition: {
                duration: 0.25,
              },
            });
            history.push("/stake-complete/" + validatorAddress);
          },
        }
      );
    } catch (e) {
      history.goBack();
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
      onBackButton={() => history.goBack()}
    >
      {validator && (
        <ValidatorDetails
          chainID={chainStore.current.chainId}
          validator={validator}
        />
      )}
      <div className="staked-amount-container">
        <div className="staked-amount-content">
          <div>Current Staked Amount</div>
          <div
            style={{
              fontWeight: "bold",
              color: amount.toDec().isPositive() ? "#3b82f6" : "black",
            }}
          >
            {amount.maxDecimals(4).trim(true).toString()}
          </div>
        </div>
      </div>
      <StakeInputField amountConfig={amountConfig} />
      <Button
        type="submit"
        color="primary"
        block
        disabled={errorText != null}
        style={{ alignItems: "end" }}
        onClick={stakeClicked}
      >
        <img
          src={activeStake}
          alt=""
          style={{
            marginRight: "5px",
            height: "15px",
          }}
        />
        Stake
      </Button>
    </HeaderLayout>
  );
});

export interface StakeInputProps {
  amountConfig: IAmountConfig;
}

export const StakeInputField: FunctionComponent<StakeInputProps> = observer(
  ({ amountConfig }) => {
    const intl = useIntl();

    const { queriesStore } = useStore();
    const queryBalances = queriesStore
      .get(amountConfig.chainId)
      .queryBalances.getQueryBech32Address(amountConfig.sender);

    const queryBalance = queryBalances.balances.find(
      (bal) =>
        amountConfig.sendCurrency.coinMinimalDenom ===
        bal.currency.coinMinimalDenom
    );
    const balance = queryBalance
      ? queryBalance.balance
      : new CoinPretty(amountConfig.sendCurrency, new Int(0));

    const error = amountConfig.error;
    const errorText: string | undefined = useMemo(() => {
      if (error) {
        switch (error.constructor) {
          case EmptyAmountError:
            // No need to show the error to user.
            return;
          case InvalidNumberAmountError:
            return intl.formatMessage({
              id: "input.amount.error.invalid-number",
            });
          case ZeroAmountError:
            return intl.formatMessage({
              id: "input.amount.error.is-zero",
            });
          case NegativeAmountError:
            return intl.formatMessage({
              id: "input.amount.error.is-negative",
            });
          case InsufficientAmountError:
            return intl.formatMessage({
              id: "input.amount.error.insufficient",
            });
          default:
            return intl.formatMessage({ id: "input.amount.error.unknown" });
        }
      }
    }, [intl, error]);

    return (
      <React.Fragment>
        <FormGroup style={{ borderRadius: "0%", marginBottom: "16px" }}>
          <Label className="form-control-label" style={{ width: "100%" }}>
            Stake Value
            <div
              className="balance"
              onClick={(e) => {
                e.preventDefault();

                amountConfig.toggleIsMax();
              }}
            >{`Balance: ${balance.trim(true).maxDecimals(6).toString()}`}</div>
          </Label>
          <Input
            className="form-control-alternative stake-value-input"
            type="number"
            value={amountConfig.amount}
            placeholder="0 FET"
            onChange={(e) => {
              e.preventDefault();
              amountConfig.setAmount(e.target.value);
            }}
            style={{ borderRadius: "0%" }}
            min={0}
            autoComplete="off"
          />
          {errorText != null ? (
            <div className="error-text">{errorText}</div>
          ) : null}
        </FormGroup>
      </React.Fragment>
    );
  }
);
