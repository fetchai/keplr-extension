import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { computed } from "mobx";
import { ObservableChainQueryMap } from "../chain-query";
import { ValidateAddress } from "./types";

export class ObservableQueryValidateAgentAddressInner extends ObservableCosmwasmContractChainQuery<ValidateAddress> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string,
    protected readonly agentAddress: string
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      validate_address: { agent_address: agentAddress },
    });
  }

  @computed
  get isValid(): boolean {
    if (!this.response || !this.response.data.is_valid) {
      return false;
    }

    return this.response.data.is_valid;
  }
}

export class ObservableQueryvalidateAddress extends ObservableChainQueryMap<ValidateAddress> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      const split = key.split("/");
      return new ObservableQueryValidateAgentAddressInner(
        this.kvStore,
        this.chainId,
        this.chainGetter,
        split[0],
        split[1]
      );
    });
  }

  getQueryContract(
    contractAddress: string,
    agentAddress: string
  ): ObservableQueryValidateAgentAddressInner {
    return this.get(
      `${contractAddress}/${agentAddress}`
    ) as ObservableQueryValidateAgentAddressInner;
  }
}
