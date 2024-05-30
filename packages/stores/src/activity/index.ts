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
    const oldNodes = Object.freeze(this.nodes);
    const updatedNodes = { ...oldNodes, ...nodes };
    this.setNodes(updatedNodes);

    console.log({ saved: this.nodes });

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
    yield this.kvStore.set<any>(`extension_activity_nodes-${this.address}-${this.chainId}`, this.nodes);
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

    const savedPageInfo = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_page_info")
    );
    this.pageInfo = savedPageInfo;

    const savedNodes = yield* toGenerator(
      this.kvStore.get<any>(`extension_activity_nodes-${this.address}-${this.chainId}`)
    );
    if (savedNodes !== undefined) this.nodes = savedNodes;
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
