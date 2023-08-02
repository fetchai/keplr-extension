import { QueriesSetBase } from "../queries";
import { ChainGetter } from "../../common";
import { KVStore } from "@keplr-wallet/common";
import { ObservableQueryEvmNativeBalanceRegistry } from "./balance";
import { DeepReadonly } from "utility-types";
import { ObservableQueryERC20Metadata } from "./erc20-info";
import { ObservableQueryErc20BalanceRegistry } from "./erc20-balance";
import { ObservableQueryNativeFetEthBrige } from "./native-fet-bridge";

export interface EvmQueries {
  evm: EvmQueriesImpl;
}

export const EvmQueries = {
  use(): (
    queriesSetBase: QueriesSetBase,
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter
  ) => EvmQueries {
    return (
      queriesSetBase: QueriesSetBase,
      kvStore: KVStore,
      chainId: string,
      chainGetter: ChainGetter
    ) => {
      return {
        evm: new EvmQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter),
      };
    };
  },
};

export class EvmQueriesImpl {
  public readonly queryErc20Metadata: DeepReadonly<ObservableQueryERC20Metadata>;
  public readonly queryNativeFetBridge: DeepReadonly<ObservableQueryNativeFetEthBrige>;

  constructor(
    base: QueriesSetBase,
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter
  ) {
    base.queryBalances.addBalanceRegistry(
      new ObservableQueryEvmNativeBalanceRegistry(kvStore)
    );

    base.queryBalances.addBalanceRegistry(
      new ObservableQueryErc20BalanceRegistry(kvStore)
    );

    this.queryErc20Metadata = new ObservableQueryERC20Metadata(
      kvStore,
      chainId,
      chainGetter
    );

    this.queryNativeFetBridge = new ObservableQueryNativeFetEthBrige(
      kvStore,
      chainGetter
    );
  }
}
