import { ChainGetter, IAccountStore, MsgOpt } from "@keplr-wallet/stores";
import {
  AmountConfig,
  GasConfig, ISenderConfig,
  useFeeConfig,
  useMemoConfig,
  useRecipientConfig, useSenderConfig
} from "./index";
import { AppCurrency } from "@keplr-wallet/types";
import { useState } from "react";
import { makeObservable, override } from "mobx";
import { QueriesStore } from "./internal";

export class DelegateAmountConfig extends AmountConfig {
  get sendableCurrencies(): AppCurrency[] {
    return [this.chainInfo.stakeCurrency];
  }
}

export class DelegateGasConfig extends GasConfig {
  constructor(
    chainGetter: ChainGetter,
    protected readonly accountStore: IAccountStore<{
      cosmos: {
        readonly msgOpts: {
          readonly delegate: MsgOpt;
        };
      };
    }>,
    initialChainId: string
  ) {
    super(chainGetter, initialChainId);

    makeObservable(this);
  }

  @override
  override get gas(): number {
    // If gas not set manually, assume that the tx is for MsgTransfer.
    if (this._value == null) {
      return this.accountStore.getAccount(this.chainId).cosmos.msgOpts.delegate
        .gas;
    }

    return super.gas;
  }
}

export const useDelegateAmountConfig = (
  chainGetter: ChainGetter,
  queriesStore: QueriesStore,
  chainId: string,
  senderConfig: ISenderConfig,
) => {
  const [txConfig] = useState(
    () =>
      new DelegateAmountConfig(
        chainGetter,
        queriesStore,
        chainId,
        senderConfig,
      )
  );
  txConfig.setChain(chainId);

  return txConfig;
};

export const useDelegateGasConfig = (
  chainGetter: ChainGetter,
  accountStore: IAccountStore<{
    cosmos: {
      readonly msgOpts: {
        readonly delegate: MsgOpt;
      };
    };
  }>,
  chainId: string
) => {
  const [gasConfig] = useState(
    () => new DelegateGasConfig(chainGetter, accountStore, chainId)
  );
  gasConfig.setChain(chainId);

  return gasConfig;
};

export const useDelegateTxConfig = (
  chainGetter: ChainGetter,
  queriesStore: QueriesStore,
  accountStore: IAccountStore<{
    cosmos: {
      readonly msgOpts: {
        readonly delegate: MsgOpt;
      };
    };
  }>,
  chainId: string,
  sender: string
) => {
  const senderConfig = useSenderConfig(chainGetter, chainId, sender);

  const amountConfig = useDelegateAmountConfig(
    chainGetter,
    queriesStore,
    chainId,
    senderConfig
  );


  const memoConfig = useMemoConfig(chainGetter, chainId);
  const gasConfig = useDelegateGasConfig(chainGetter, accountStore, chainId);
  const feeConfig = useFeeConfig(
    chainGetter,
    queriesStore,
    chainId,
    senderConfig,
    amountConfig,
    gasConfig
  );
  // Due to the circular references between the amount config and gas/fee configs,
  // set the fee config of the amount config after initing the gas/fee configs.
  amountConfig.setFeeConfig(feeConfig);

  const recipientConfig = useRecipientConfig(chainGetter, chainId);
  recipientConfig.setBech32Prefix(
    chainGetter.getChain(chainId).bech32Config.bech32PrefixValAddr
  );

  return {
    amountConfig,
    memoConfig,
    gasConfig,
    feeConfig,
    recipientConfig,
  };
};
