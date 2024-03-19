import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { ObservableChainQueryMap } from "../chain-query";
import { computed } from "mobx";

export class ObservableQueryCalculatePaymentInner extends ObservableCosmwasmContractChainQuery<any> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string,
    protected readonly domain: string,
    protected readonly duration_in_sec: number
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      calculate_registration_payment: {
        domain: domain,
        duration_in_sec: duration_in_sec,
      },
    });
  }

  @computed
  get value(): any {
    return this?.response?.data;
  }
}

export class ObservableQueryCalculatePayment extends ObservableChainQueryMap<ObservableQueryCalculatePaymentInner> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      const split = key.split("/");
      return new ObservableQueryCalculatePaymentInner(
        this.kvStore,
        this.chainId,
        this.chainGetter,
        split[0],
        split[1],
        parseFloat(split[2])
      );
    });
  }

  getQueryContract(
    contractAddress: string,
    domain: string,
    durationInSeconds: number
  ): ObservableQueryCalculatePaymentInner {
    const key = `${contractAddress}/${domain}/${durationInSeconds}`;
    return this.get(key) as ObservableQueryCalculatePaymentInner;
  }
}
