import { action, makeObservable, observable } from "mobx";

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
  }

  constructor() {
    makeObservable(this);
  }

  @action
  setNodes(nodes: any) {
    this.nodes = nodes;
  }

  @action
  setPageInfo(pageInfo: any) {
    this.pageInfo = pageInfo;
  }

  @action
  setAddress(address: string) {
    this.address = address;
  }

  @action
  setChainId(chainId: string) {
    this.chainId = chainId;
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
