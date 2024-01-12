import { makeAutoObservable, observable } from "mobx";
import { MessagesStore } from "./message-slice";
import { UserDetailsStore } from "./user-details";
import { ProposalStore } from "./proposal-slice";
import { NewGroupStore } from "./new-group-slice";

export class ChatStore {
  public readonly userDetailsStore: UserDetailsStore;
  public readonly messagesStore: MessagesStore;
  public readonly proposalStore: ProposalStore;
  public readonly newGroupStore: NewGroupStore;


  constructor() {
    this.userDetailsStore = new UserDetailsStore();
    this.messagesStore = new MessagesStore();
    this.proposalStore = new ProposalStore();
    this.newGroupStore = new NewGroupStore();


    makeAutoObservable(this, {
      userDetailsStore: observable,
      messagesStore: observable,
      proposalStore: observable,
      newGroupStore: observable
    });
  }
}

export const chatStore = new ChatStore();
