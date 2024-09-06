import {
  ChainStore,
  QueriesStore,
  AccountStore,
  CosmosAccount,
  CosmosQueries,
  ActivityStore,
  TokenGraphStore,
} from "@keplr-wallet/stores";
import { IndexedDBKVStore } from "@keplr-wallet/common";
import { ChainInfo } from "@keplr-wallet/types";
import { EmbedChainInfos } from "../config";
import { getWCKeplr } from "../get-wc-keplr";

export class RootStore {
  public readonly chainStore: ChainStore;

  public readonly queriesStore: QueriesStore<[CosmosQueries]>;
  public readonly accountStore: AccountStore<[CosmosAccount]>;
  public readonly activityStore: ActivityStore;
  public readonly tokenGraphStore: TokenGraphStore;
  public readonly accountBaseStore: IndexedDBKVStore;

  constructor() {
    this.chainStore = new ChainStore<ChainInfo>(EmbedChainInfos);

    this.queriesStore = new QueriesStore(
      new IndexedDBKVStore("store_queries"),
      this.chainStore,
      CosmosQueries.use()
    );

    this.activityStore = new ActivityStore(
      new IndexedDBKVStore("store_activity_config"),
      this.chainStore
    );

    this.tokenGraphStore = new TokenGraphStore(
      new IndexedDBKVStore("store_token_graph_config"),
      this.chainStore
    );

    this.accountBaseStore = new IndexedDBKVStore("store_account_config");

    this.accountStore = new AccountStore(
      window,
      this.chainStore,
      this.activityStore,
      this.tokenGraphStore,
      this.accountBaseStore,
      () => {
        return {
          suggestChain: false,
          autoInit: true,
          getKeplr: getWCKeplr,
        };
      },
      CosmosAccount.use({
        queriesStore: this.queriesStore,
      })
    );
  }
}

export function createRootStore() {
  return new RootStore();
}
