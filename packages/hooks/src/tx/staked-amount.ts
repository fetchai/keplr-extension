import { IAmountConfig, UIProperties } from "./types";
import { TxChainSetter } from "./chain";
import { ChainGetter, CoinPrimitive } from "@keplr-wallet/stores";
import { action, computed, makeObservable, observable } from "mobx";
import { AppCurrency } from "@keplr-wallet/types";
import {
  EmptyAmountError,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError
} from "./errors";
import { CoinPretty, Dec, DecUtils } from "@keplr-wallet/unit";
import { useState } from "react";
import { QueriesStore } from "./internal";

export class StakedAmountConfig extends TxChainSetter implements IAmountConfig {
  @observable
  protected _sender: string;

  @observable
  protected _validatorAddress: string;

  @observable
  protected _value: string;

  @observable
  protected _fraction: number = 0;

  constructor(
    chainGetter: ChainGetter,
    protected readonly queriesStore: QueriesStore,
    initialChainId: string,
    sender: string,
    initialValidatorAddress: string
  ) {
    super(chainGetter, initialChainId);

    this._sender = sender;
    this._value = "";
    this._validatorAddress = initialValidatorAddress;

    makeObservable(this);
  }

  @action
  setValidatorAddress(validatorAddress: string) {
    this._validatorAddress = validatorAddress;
  }

  get validatorAddress(): string {
    return this._validatorAddress;
  }

  @action
  setSender(sender: string) {
    this._sender = sender;
  }

  @action
  setCurrency() {
    // noop
  }

  @action
  setValue(value: string) {
    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (this.isMax) {
      this.setIsMax(false);
    }
    this._value = value;
  }

  @action
  setIsMax(isMax: boolean) {
    this._fraction = isMax ? 1 : 0;
  }

  @action
  toggleIsMax() {
    this.setIsMax(!this.isMax);
  }

  get isMax(): boolean {
    return this._fraction === 1;
  }

  get fraction(): number {
    return this._fraction;
  }

  @action
  setFraction(value: number) {
    this._fraction = value;
  }

  get sender(): string {
    return this._sender;
  }

  @computed
  get value(): string {
    if (!this.queriesStore.get(this.chainId).cosmos) {
      throw new Error("No querier for delegations");
    }

    if (this.fraction != null) {
      const result = this.queriesStore
        .get(this.chainId)
        .cosmos!.queryDelegations.getQueryBech32Address(this.sender)
        .getDelegationTo(this.validatorAddress);

      if (result.toDec().lte(new Dec(0))) {
        return "0";
      }

      return result
        .mul(new Dec(this.fraction))
        .trim(true)
        .locale(false)
        .hideDenom(true)
        .toString();
    }

    return this._value;
  }

  getAmountPrimitive(): CoinPrimitive {
    const amountStr = this.value;
    const currency = this.currency;

    if (!amountStr) {
      return {
        denom: currency.coinMinimalDenom,
        amount: "0",
      };
    }

    try {
      return {
        denom: currency.coinMinimalDenom,
        amount: new Dec(amountStr)
          .mul(DecUtils.getPrecisionDec(currency.coinDecimals))
          .truncate()
          .toString(),
      };
    } catch {
      return {
        denom: currency.coinMinimalDenom,
        amount: "0",
      };
    }
  }

  @computed
  get currency(): AppCurrency {
    return this.chainInfo.stakeCurrency;
  }

  get selectableCurrencies(): AppCurrency[] {
    return [this.chainInfo.stakeCurrency];
  }

  @computed
  get amount(): CoinPretty[] {
    return [];
  }

  @computed
  get uiProperties(): UIProperties {
    if (!this.queriesStore.get(this.chainId).cosmos) {
      throw new Error("No querier for delegations");
    }

    const currency = this.currency;
    if (!currency) {
      return {
        error: new Error("Currency to send not set"),
      }
    }
    if (this.value === "") {
      return {
        error: new EmptyAmountError("Amount is empty"),
      }
    }
    if (Number.isNaN(parseFloat(this.value))) {
      return {
        error: new InvalidNumberAmountError("Invalid form of number"),
      }
    }
    let dec;
    try {
      dec = new Dec(this.value);
      if (dec.equals(new Dec(0))) {
        return {
          error: new ZeroAmountError("Amount is zero"),
        }
      }
    } catch {
      return {
        error: new InvalidNumberAmountError("Invalid form of number"),
      }
    }
    if (new Dec(this.value).lt(new Dec(0))) {
      return {
        error: new NegativeAmountError("Amount is negative"),
      }
    }

    const balance = this.queriesStore
      .get(this.chainId)
      .cosmos!.queryDelegations.getQueryBech32Address(this.sender)
      .getDelegationTo(this.validatorAddress);
    const balanceDec = balance.toDec();
    if (dec.gt(balanceDec)) {
      return {
        error: new InsufficientAmountError("Insufficient amount"),
      }
    }

    return {};
  }
}

export const useStakedAmountConfig = (
  chainGetter: ChainGetter,
  queriesStore: QueriesStore,
  chainId: string,
  sender: string,
  validatorAddress: string
) => {
  const [txConfig] = useState(
    () =>
      new StakedAmountConfig(
        chainGetter,
        queriesStore,
        chainId,
        sender,
        validatorAddress
      )
  );
  txConfig.setChain(chainId);
  txConfig.setSender(sender);
  txConfig.setValidatorAddress(validatorAddress);

  return txConfig;
};
