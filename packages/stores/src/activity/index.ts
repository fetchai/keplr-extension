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

  // updates or adds new nodes to the list
  updateNodes(nodes: any) {
    const updatedNodes = { ...this.nodes, ...nodes };
    this.setNodes(updatedNodes);

    this.saveNodes();
  }

  getSortedNodesByTimeStamps() {
    const sortedNodes = Object.values(this.nodes).sort((a: any, b: any) => {
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

  @flow
  *saveNodes() {
    const currNodes = Object.keys(this.nodes).length > 0 ? this.nodes : {};
    yield this.kvStore.set<any>(
      `extension_activity_nodes-${this.address}-${this.chainId}`,
      currNodes
    );
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
    yield this.kvStore.set<any>(
      `extension_activity_page-info-${this.address}-${this.chainId}`,
      this.pageInfo
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
    const savedAddress = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_address")
    );
    this.address = savedAddress;

    const savedChainId = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_chain_id")
    );
    this.chainId = savedChainId;
  }

  @flow
  *accountInit() {
    const savedNodes = yield* toGenerator(
      this.kvStore.get<any>(
        `extension_activity_nodes-${this.address}-${this.chainId}`
      )
    );
    this.nodes = savedNodes !== undefined ? savedNodes : {};

    const savedPageInfo = yield* toGenerator(
      this.kvStore.get<any>(
        `extension_activity_page-info-${this.address}-${this.chainId}`
      )
    );
    this.pageInfo = savedPageInfo;
  }

  @action
  addNode(node: any) {
    this.updateNodes({ [node.id]: node });
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

  get sortedNodes() {
    return this.getSortedNodesByTimeStamps();
  }
}
