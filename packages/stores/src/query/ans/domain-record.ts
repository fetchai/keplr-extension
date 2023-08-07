import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { computed } from "mobx";
import { ObservableChainQueryMap } from "../chain-query";
import { DomainRecord } from "./types";

export class ObservableQueryDomainRecordInner extends ObservableCosmwasmContractChainQuery<DomainRecord> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string,
    protected readonly domain: string
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      domain_record: { domain: domain },
    });
  }

  @computed
  get isPublic(): boolean {
    if (!this.response || !this.response.data.is_available) {
      return false;
    }

    return this.response.data.is_available;
  }

  get isAvailable(): boolean {
    if (!this.response || !this.response.data) {
      return false;
    }

    return this.response.data.is_available;
  }

  @computed
  get record(): any | undefined {
    if (!this.response || !this.response.data) {
      return;
    }

    return this.response.data.record;
  }
}

export class ObservableQueryDomainRecord extends ObservableChainQueryMap<DomainRecord> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      const split = key.split("/");
      return new ObservableQueryDomainRecordInner(
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
    domain: string
  ): ObservableQueryDomainRecordInner {
    return this.get(
      `${contractAddress}/${domain}`
    ) as ObservableQueryDomainRecordInner;
  }
}
