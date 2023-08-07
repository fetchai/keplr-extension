import { QueriesSetBase } from "../queries";
import { ChainGetter } from "../../common";
import { KVStore } from "@keplr-wallet/common";
import { DeepReadonly } from "utility-types";
import { ObservableQueryDomainRecord } from "./domain-record";
import { ObservableQueryPermissions } from "./permissions";
import { ObservableQueryContractState } from "./contract-state";
import { ObservableQueryPublicDomains } from "./public-domains";
import { ObservableQueryvalidateAddress } from "./validate-address";

export interface ANSQueries {
  ans: ANSQueriesImpl;
}

export const ANSQueries = {
  use(): (
    queriesSetBase: QueriesSetBase,
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter
  ) => ANSQueries {
    return (
      queriesSetBase: QueriesSetBase,
      kvStore: KVStore,
      chainId: string,
      chainGetter: ChainGetter
    ) => {
      return {
        ans: new ANSQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter),
      };
    };
  },
};

export class ANSQueriesImpl {
  public readonly queryDomainRecord: DeepReadonly<ObservableQueryDomainRecord>;
  public readonly queryPermissions: DeepReadonly<ObservableQueryPermissions>;
  public readonly queryContractState: DeepReadonly<ObservableQueryContractState>;
  public readonly queryPublicDomains: DeepReadonly<ObservableQueryPublicDomains>;
  public readonly queryVaildateAgentAddress: DeepReadonly<ObservableQueryvalidateAddress>;

  constructor(
    _base: QueriesSetBase,
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter
  ) {
    this.queryDomainRecord = new ObservableQueryDomainRecord(
      kvStore,
      chainId,
      chainGetter
    );
    this.queryPermissions = new ObservableQueryPermissions(
      kvStore,
      chainId,
      chainGetter
    );
    this.queryContractState = new ObservableQueryContractState(
      kvStore,
      chainId,
      chainGetter
    );
    this.queryPublicDomains = new ObservableQueryPublicDomains(
      kvStore,
      chainId,
      chainGetter
    );
    this.queryVaildateAgentAddress = new ObservableQueryvalidateAddress(
      kvStore,
      chainId,
      chainGetter
    );
  }
}
