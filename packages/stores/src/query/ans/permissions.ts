import { ObservableCosmwasmContractChainQuery } from "../cosmwasm/contract-query";
import { KVStore } from "@keplr-wallet/common";
import { ChainGetter } from "../../common";
import { ObservableChainQueryMap } from "../chain-query";
import { Permissions } from "./types";

export class ObservableQueryPermissionsInner extends ObservableCosmwasmContractChainQuery<Permissions> {
  constructor(
    kvStore: KVStore,
    chainId: string,
    chainGetter: ChainGetter,
    protected override readonly contractAddress: string,
    protected readonly owner: string,
    protected readonly domain: string
  ) {
    super(kvStore, chainId, chainGetter, contractAddress, {
      permissions: {
        owner: owner,
        domain: domain,
      },
    });
  }

  get permissions(): any | undefined {
    return this.response?.data?.permissions;
  }
}

export class ObservableQueryPermissions extends ObservableChainQueryMap<Permissions> {
  constructor(
    protected override readonly kvStore: KVStore,
    protected override readonly chainId: string,
    protected override readonly chainGetter: ChainGetter
  ) {
    super(kvStore, chainId, chainGetter, (key: string) => {
      const split = key.split("/");
      return new ObservableQueryPermissionsInner(
        this.kvStore,
        this.chainId,
        this.chainGetter,
        split[0],
        split[1],
        split[2]
      );
    });
  }

  getQueryContract(
    contractAddress: string,
    owner: string,
    domain: string
  ): ObservableQueryPermissionsInner {
    return this.get(
      `${contractAddress}/${owner}/${domain}`
    ) as ObservableQueryPermissionsInner;
  }
}
