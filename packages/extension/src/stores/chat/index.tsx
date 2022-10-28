import { observable, action, makeObservable } from "mobx";

export interface Message {
  id: string;
  sender: string;
  target: string;
  contents: string;
  expiryTimestamp: string;
  commitTimestamp: string;
}

export interface MessageMap {
  [key: string]: Message;
}

interface ContactState {
  messages: MessageMap;
  lastMessage?: Message;
  pubKey?: string;
}

interface MessagesState {
  [key: string]: ContactState;
}

interface BlockedAddressState {
  [key: string]: boolean;
}

interface PubKey {
  contact: string;
  value: string;
}

interface State {
  chat: MessagesState;
  blockedAddress: BlockedAddressState;
  errorMessage?: { type: string; message: string; level: number };
}
export class Chat {
  @observable
  protected messages: State = {
    chat: {},
    blockedAddress: {},
  };

  constructor() {
    makeObservable(this);
  }
  @action
  addMessageList(chat: MessagesState) {
    this.messages.chat = chat;
    this.messages.errorMessage = { type: "", message: "", level: 0 };
  }
  @action
  updateAuthorMessage(message: Message) {
    const { sender, id } = message;
    this.messages.chat[sender].messages[id] = message;
    this.messages.chat[sender].lastMessage = message;
  }
  @action
  updateSenderMessage(message: Message) {
    const { target, id } = message;
    if (!this.messages.chat[target]) {
      this.messages.chat[target] = {
        messages: {},
        lastMessage: message, //todo
      };
    }
    this.messages.chat[target].messages[id] = message;
    this.messages.chat[target].lastMessage = message;
  }
  @action
  setAuthorPubKey(publickey: PubKey) {
    const { contact, value } = publickey;
    this.messages.chat[contact].pubKey = value;
  }
  @action
  setBlockedList(blockListData: any) {
    const blockedList = blockListData;
    this.messages.blockedAddress = {};
    blockedList.map(({ blockedAddress }: { blockedAddress: string }) => {
      this.messages.blockedAddress[blockedAddress] = true;
    });
  }
  @action
  setBlockedUser(blockListData: any) {
    const { blockedAddress } = blockListData;
    this.messages.blockedAddress[blockedAddress] = true;
  }
  @action
  setUnblockedUser(blockListData: any) {
    const { blockedAddress } = blockListData;
    this.messages.blockedAddress[blockedAddress] = false;
  }
  @action
  setMessageError(blockListData: any) {
    this.messages.errorMessage = blockListData;
  }
  get userMessages() {
    return this.messages.chat;
  }
  get userMessagesError() {
    return this.messages.errorMessage;
  }
  get userBlockedAddresses() {
    return this.messages.blockedAddress;
  }
}
