import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { ObservableChainQueryMap } from "../chain-query";
import { ContractState } from "./types";
export class ObservableQueryContractStateInner extends ObservableCosmwasmContractChainQuery<ContractState> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      contract_state: {},
    });
  }

  get almanacAddress(): string | undefined {
    return this.response?.data?.state.almanac_address;
  }
}

export class ObservableQueryContractState extends ObservableChainQueryMap<ContractState> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      return new ObservableQueryContractStateInner(
        this.kvStore,
        this.chainId,
        this.chainGetter,
        key
      );
    });
  }

  getQueryContract(contractAddress: string): ObservableQueryContractStateInner {
    return this.get(contractAddress) as ObservableQueryContractStateInner;
  }
}
