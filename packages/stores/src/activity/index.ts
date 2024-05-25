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

  updateNodes(nodes: any, append?: boolean) {
    const newNodes = append ? { ...this.nodes, ...nodes } : { ...nodes };
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
    this.nodes = savedNodes;

    const savedAddress = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_address")
    );
    this.address = savedAddress;

    const savedChainId = yield* toGenerator(
      this.kvStore.get<any>("extension_activity_chain_id")
    );
    this.chainId = savedChainId;
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
}
