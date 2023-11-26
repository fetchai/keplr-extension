import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import classnames from "classnames";
import styleCoinInput from "./coin-input.module.scss";

import { Button, FormGroup, Input } from "reactstrap";
import { observer } from "mobx-react-lite";
import {
  EmptyAmountError,
  InvalidNumberAmountError,
  ZeroAmountError,
  NegativeAmountError,
  InsufficientAmountError,
  IAmountConfig,
  BridgeAmountError,
} from "@keplr-wallet/hooks";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import { useIntl } from "react-intl";
import { useStore } from "../../stores";
import { AppCurrency } from "@keplr-wallet/types";
import { useLanguage } from "../../languages";
import { Card } from "../card";
import { Dropdown } from "../dropdown";

export interface CoinInputProps {
  amountConfig: IAmountConfig;

  balanceText?: string;

  className?: string;
  label?: string;

  disableAllBalance?: boolean;

  overrideSelectableCurrencies?: AppCurrency[];
  dropdownDisabled?: boolean;
}

export const CoinInput: FunctionComponent<CoinInputProps> = observer(
  ({ amountConfig, className, disableAllBalance }) => {
    const intl = useIntl();
    const [inputInUsd, setInputInUsd] = useState<string | undefined>("");
    const { priceStore } = useStore();

    const language = useLanguage();
    const fiatCurrency = language.fiatCurrency;
    const convertToUsd = (currency: any) => {
      const value = priceStore.calculatePrice(currency, fiatCurrency);
      const inUsd = value && value.shrink(true).maxDecimals(6).toString();
      return inUsd;
    };
    useEffect(() => {
      const amountInNumber = parseFloat(amountConfig.amount) * 10 ** 18;
      const inputValue = new CoinPretty(
        amountConfig.sendCurrency,
        new Int(amountConfig.amount ? amountInNumber : 0)
      );
      const inputValueInUsd = convertToUsd(inputValue);
      setInputInUsd(inputValueInUsd);
    }, [amountConfig.amount]);

    const [randomId] = useState(() => {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      return Buffer.from(bytes).toString("hex");
    });

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
          case BridgeAmountError:
            return error.message;
          default:
            return intl.formatMessage({ id: "input.amount.error.unknown" });
        }
      }
    }, [intl, error]);
    return (
      <React.Fragment>
        <FormGroup
          className={className}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className={styleCoinInput["input-container"]}>
            <div className={styleCoinInput["amount-label"]}>Amount</div>
            <Input
              placeholder={`0 ${amountConfig.sendCurrency.coinDenom}`}
              className={classnames(
                "form-control-alternative",
                styleCoinInput["input"]
              )}
              id={`input-${randomId}`}
              type="number"
              value={amountConfig.amount}
              onChange={(e: any) => {
                e.preventDefault();
                amountConfig.setAmount(e.target.value);
              }}
              min={0}
              autoComplete="off"
            />
            <div className={styleCoinInput["amount-usd"]}>{inputInUsd}</div>
          </div>

          <div className={styleCoinInput["right-widgets"]}>
            <img src={require("@assets/svg/wireframe/chevron.svg")} alt="" />
            {!disableAllBalance ? (
              <Button
                className={styleCoinInput["max"]}
                onClick={(e) => {
                  e.preventDefault();
                  amountConfig.toggleIsMax();
                }}
              >
                MAX
              </Button>
            ) : null}
          </div>
        </FormGroup>
        {errorText != null ? (
          <div className={styleCoinInput["errorText"]}>{errorText}</div>
        ) : null}
      </React.Fragment>
    );
  }
);
export interface TokenDropdownProps {
  dropdownDisabled?: boolean;
  amountConfig: IAmountConfig;
  overrideSelectableCurrencies?: AppCurrency[];
}
export const TokenSelectorDropdown: React.FC<TokenDropdownProps> = ({
  amountConfig,
  overrideSelectableCurrencies,
}) => {
  const [isOpenTokenSelector, setIsOpenTokenSelector] = useState(false);
  const [inputInUsd, setInputInUsd] = useState<string | undefined>("");

  // const [randomId] = useState(() => {
  //   const bytes = new Uint8Array(4);
  //   crypto.getRandomValues(bytes);
  //   return Buffer.from(bytes).toString("hex");
  // });

  const { queriesStore, priceStore } = useStore();
  const queryBalances = queriesStore
    .get(amountConfig.chainId)
    .queryBalances.getQueryBech32Address(amountConfig.sender);

  const selectableCurrencies = (
    overrideSelectableCurrencies || amountConfig.sendableCurrencies
  )
    .filter((cur) => {
      const bal = queryBalances.getBalanceFromCurrency(cur);
      return !bal.toDec().isZero();
    })
    .sort((a, b) => {
      return a.coinDenom < b.coinDenom ? -1 : 1;
    });

  const queryBalance = queryBalances.balances.find(
    (bal) =>
      amountConfig.sendCurrency.coinMinimalDenom ===
      bal.currency.coinMinimalDenom
  );
  const balance = queryBalance
    ? queryBalance.balance
    : new CoinPretty(amountConfig.sendCurrency, new Int(0));

  const language = useLanguage();
  const fiatCurrency = language.fiatCurrency;
  const convertToUsd = (currency: any) => {
    const value = priceStore.calculatePrice(currency, fiatCurrency);
    const inUsd = value && value.shrink(true).maxDecimals(6).toString();
    return inUsd;
  };
  useEffect(() => {
    const valueInUsd = convertToUsd(balance);
    setInputInUsd(valueInUsd);
  }, [amountConfig.sendCurrency]);

  const balancesMap = new Map(
    queryBalances.balances.map((bal) => [
      bal.currency.coinMinimalDenom,
      bal.balance,
    ])
  );
  return (
    <React.Fragment>
      <Card
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        onClick={() => setIsOpenTokenSelector(!isOpenTokenSelector)}
        heading={
          <div>
            Asset <div>{amountConfig.sendCurrency.coinDenom}</div>
          </div>
        }
        rightContent={require("@assets/svg/wireframe/chevron-down.svg")}
        subheading={
          <div>
            {" "}
            {`Available: ${balance.shrink(true).maxDecimals(6).toString()} `}
            {inputInUsd && `(${inputInUsd} USD)`}
          </div>
        }
      />
      <Dropdown
        setIsOpen={setIsOpenTokenSelector}
        isOpen={isOpenTokenSelector}
        title="Asset"
        closeClicked={() => setIsOpenTokenSelector(false)}
      >
        {selectableCurrencies.map((currency) => {
          const currencyBalance =
            balancesMap.get(currency.coinMinimalDenom) ||
            new CoinPretty(currency, new Int(0));

          return (
            <Card
              heading={currency.coinDenom}
              key={currency.coinMinimalDenom}
              isActive={
                currency.coinMinimalDenom ===
                amountConfig.sendCurrency.coinMinimalDenom
              }
              onClick={async (e: any) => {
                e.preventDefault();
                amountConfig.setSendCurrency(currency);
              }}
              rightContent={`${currencyBalance
                .shrink(true)
                .maxDecimals(6)
                .toString()}`}
            />
          );
        })}
      </Dropdown>
    </React.Fragment>
  );
};
