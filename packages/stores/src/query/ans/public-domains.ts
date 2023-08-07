// public-domains.ts
import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { PublicDomains } from "./types";
import { ObservableChainQueryMap } from "../chain-query";
import { computed } from "mobx";

export class ObservableQueryPublicDomainsInner extends ObservableCosmwasmContractChainQuery<PublicDomains> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      public_domains: {},
    });
  }

  @computed
  get publicDomains(): string[] | undefined {
    if (!this.response || !this.response.data.public_domains) {
      return [];
    }
    return this.response.data.public_domains;
  }
}

export class ObservableQueryPublicDomains extends ObservableChainQueryMap<PublicDomains> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      return new ObservableQueryPublicDomainsInner(
        this.kvStore,
        this.chainId,
        this.chainGetter,
        key
      );
    });
  }
  getQueryContract(contractAddress: string): ObservableQueryPublicDomainsInner {
    return this.get(contractAddress) as ObservableQueryPublicDomainsInner;
  }
}
