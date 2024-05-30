import { KVStore, toGenerator } from "@keplr-wallet/common";
import { action, flow, makeObservable, observable } from "mobx";

export class ActivityStore {
  @observable
  protected nodes: any = {};

  @observable
  protected pageInfo: any;

  @observable
  protected address: string = "";

  @observable
  protected chainId: string = "";

  @observable
  protected pendingTransactions: any = {};

  filterNewNodes(nodes: any, nodeMap: any) {
    const alreadyVisited: any = {};
    Object.values(nodes).map((node: any) => {
      if (nodeMap[node.id] !== undefined) {
        alreadyVisited[node.id] = 1;
      }
      nodeMap[node.id] = node;
    });
    if (Object.keys(alreadyVisited).length > 0)
      this.removePendingTransactions(alreadyVisited);
  }

  filterSavedNodes(nodes: any, nodeMap: any) {
    Object.values(nodes).map((node: any) => {
      if (nodeMap[node.id] === undefined) {
        nodeMap[node.id] = node;
      }
    });
  }

  sortByTimeStamps(nodeMap: any) {
    const sortedNodes = Object.values(nodeMap).sort((a: any, b: any) => {
      if (a.block.timestamp < b.block.timestamp) {
        return 1;
      } else if (a.block.timestamp > b.block.timestamp) {
        return -1;
      } else {
        return 0;
      }
    });

    return sortedNodes;
  }

  updateNodes(nodes: any, append?: boolean) {
    const nodeMap: any = {};

    this.filterNewNodes(this.pendingTransactions, nodeMap);
    this.filterNewNodes(nodes, nodeMap);
    if (append) {
      this.filterSavedNodes(this.nodes, nodeMap);
    }

    const newNodes = this.sortByTimeStamps(nodeMap);
    this.setNodes(newNodes);
    console.log({ pending: this.pendingTransactions, saved: this.nodes });

    this.saveNodes();
  }

  @flow
  *saveNodes() {
    yield this.kvStore.set<any>("extension_activity_nodes", this.nodes);
  }

  @flow
  *saveAddress() {
    yield this.kvStore.set<any>("extension_activity_address", this.address);
  }

  @flow
  *saveChainId() {
    yield this.kvStore.set<any>("extension_activity_chain_id", this.chainId);
  }

  @flow
  *savePageInfo() {
    yield this.kvStore.set<any>("extension_activity_page_info", this.pageInfo);
  }

  @flow
  *savePendingTransactions() {
    yield this.kvStore.set<any>(
      "extension_activity_page_pending_transactions",
      this.pendingTransactions
    );
  }

  getNode(id: any) {
    return this.nodes[id];
  }

  constructor(protected readonly kvStore: KVStore) {
    makeObservable(this);

    this.init();
  }

  @flow
  *init() {
    const savedNodes = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_nodes")
    );
    if (savedNodes !== undefined) this.nodes = savedNodes;

    const savedPendingTxn = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_page_pending_transactions")
    );

    if (savedPendingTxn !== undefined)
      this.pendingTransactions = savedPendingTxn;

    const savedAddress = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_address")
    );
    this.address = savedAddress;

    const savedChainId = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_chain_id")
    );
    this.chainId = savedChainId;

    const savedPageInfo = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_page_info")
    );
    this.pageInfo = savedPageInfo;
  }

  @action
  clearPendingTxn() {
    this.pendingTransactions = {};
  }

  @action
  addNode(node: any) {
    const nodeMap: any = {};

    Object.values(this.pendingTransactions).map((item: any) => {
      nodeMap[item.id] = item;
    });

    nodeMap[node.id] = node;

    this.setPendingTransactions(nodeMap);
    this.updateNodes({}, true);

    this.savePendingTransactions();
  }

  @action
  removePendingTransactions(alreadyVisited: any) {
    const nodeMap: any = {};

    Object.values(this.pendingTransactions).map((item: any) => {
      if (alreadyVisited[item.id] === undefined) {
        nodeMap[item.id] = item;
      }
    });

    this.setPendingTransactions(nodeMap);
    this.updateNodes({}, true);
    this.savePendingTransactions();
  }

  @action
  setNodes(nodes: any) {
    this.nodes = nodes;
  }

  @action
  setNode(id: any, node: any) {
    this.nodes[id] = node;
  }

  @action
  setPageInfo(pageInfo: any) {
    this.pageInfo = pageInfo;
    this.savePageInfo();
  }

  @action
  setAddress(address: string) {
    this.address = address;
    this.saveAddress();
  }

  @action
  setChainId(chainId: string) {
    this.chainId = chainId;
    this.saveChainId();
  }

  @action
  setPendingTransactions(nodes: any) {
    this.pendingTransactions = nodes;
    this.savePendingTransactions();
  }

  get getNodes() {
    return this.nodes;
  }

  get getPageInfo() {
    return this.pageInfo;
  }

  get getChainId() {
    return this.chainId;
  }

  get getAddress() {
    return this.address;
  }

  get getPendingTransactions() {
    return this.pendingTransactions;
  }
}
