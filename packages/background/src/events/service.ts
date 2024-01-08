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
}
