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
    Object.values(nodes).map((node: any) => {
      nodeMap[node.id] = node;
    });
  }

  filterSavedNodes(nodeMap: any) {
    Object.values(this.nodes).map((node: any) => {
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

    this.filterNewNodes(nodes, nodeMap);
    if (append) {
      this.filterSavedNodes(nodeMap);
    }

    const newNodes = this.sortByTimeStamps(nodeMap);
    this.setNodes(newNodes);

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

    const savedAddress = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_address")
    );
    this.address = savedAddress;

    const savedChainId = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_chain_id")
    );
    this.chainId = savedChainId;

    const pageInfo = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_page_info")
    );

    this.pageInfo = pageInfo;
  }

  @action
  addNode(node: any) {
    const newNode = this.getNodes;
    newNode[node.id] = node;
    this.updateNodes(newNode, true);
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
