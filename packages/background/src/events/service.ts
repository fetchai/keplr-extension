import EventEmitter from "events";
import { eventEmitter } from "./event-emitter";

export class EventService {
  public eventEmitter: EventEmitter;
  constructor() {
    this.eventEmitter = eventEmitter;
  }

  public subscribeStatusChange(handler: any) {
    this.eventEmitter.on("statusChanged", handler);
  }

  public unSubscribeStatusChange(handler: any) {
    this.eventEmitter.off("statusChanged", handler);
  }

  public unSubscribeAccountChange(handler: any) {
    this.eventEmitter.off("accountChanged", handler);
  }

  public subscribeAccountChange(handler: any) {
    this.eventEmitter.on("accountChanged", handler);
  }

  public subscribeNetworkChange(handler: any) {
    this.eventEmitter.on("networkChanged", handler);
  }

  public unSubscribeNetworkChange(handler: any) {
    this.eventEmitter.off("networkChanged", handler);
  }

  public subscribeTxSuccessful(handler: any) {
    this.eventEmitter.on("txSuccessful", handler);
  }

  public unSubscribeTxSuccessful(handler: any) {
    this.eventEmitter.off("txSuccessful", handler);
  }

  public subscribeTxFailed(handler: any) {
    this.eventEmitter.on("txFailed", handler);
  }

  public unSubscribeTxFailed(handler: any) {
    this.eventEmitter.off("txFailed", handler);
  }

  public subscribeEVMTxSuccessful(handler: any) {
    this.eventEmitter.on("EVMTxSuccessful", handler);
  }

  public unSubscribeEVMTxSuccessful(handler: any) {
    this.eventEmitter.off("EVMTxSuccessful", handler);
  }

  public subscribeEVMTxFailed(handler: any) {
    this.eventEmitter.on("EVMTxFailed", handler);
  }

  public unSubscribeEVMTxFailed(handler: any) {
    this.eventEmitter.off("EVMTxFailed", handler);
  }
}
