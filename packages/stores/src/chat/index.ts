import { makeAutoObservable, observable } from "mobx";
import { MessagesStore } from "./message-slice";
import { UserDetailsStore } from "./user-details";

export class ChatStore {
  public readonly userDetailsStore: UserDetailsStore;
  public readonly messagesStore: MessagesStore;

  constructor() {
    this.userDetailsStore = new UserDetailsStore();
    this.messagesStore = new MessagesStore();

    makeAutoObservable(this, {
      userDetailsStore: observable,
      messagesStore: observable,
    });
  }
}

export const chatStore = new ChatStore();
