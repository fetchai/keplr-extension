import { makeAutoObservable } from "mobx";
import { GROUP_PAGE_COUNT, CHAT_PAGE_COUNT } from "./constants";
const initialState: any = {
  groups: {},
  agents: {},
  groupsPagination: {
    page: -1,
    pageCount: GROUP_PAGE_COUNT,
    lastPage: 0,
    total: GROUP_PAGE_COUNT,
  },
  chats: {},
  blockedAddress: {},
  isChatGroupPopulated: false,
  isChatSubscriptionActive: false,
};

export class MessagesStore {
  groups = {};
  agents = {};
  groupsPagination = {
    page: -1,
    pageCount: GROUP_PAGE_COUNT,
    lastPage: 0,
    total: GROUP_PAGE_COUNT,
  };
  chats: any = {};
  blockedAddress = {};
  errorMessage: any;
  isChatGroupPopulated = false;
  isChatSubscriptionActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  setGroups(groups: any, pagination: any) {
    this.groupsPagination = pagination;

    const chatGroup = Object.keys(groups)
      .filter((key) => !key.includes("agent"))
      .reduce((obj: any, key) => {
        obj[key] = groups[key];
        return obj;
      }, {});
    if (Object.keys(chatGroup).length > 0)
      this.groups = { ...this.groups, ...chatGroup };

    const chatAgent = Object.keys(groups)
      .filter((key) => key.includes("agent"))
      .reduce((obj: any, key) => {
        obj[key] = groups[key];
        return obj;
      }, {});

    if (Object.keys(chatAgent).length > 0)
      this.agents = { ...this.agents, ...chatAgent };
  }

  updateChatList(userAddress: any, messages: any, pagination: any) {
    if (!this.chats[userAddress])
      this.chats[userAddress] = {
        contactAddress: userAddress,
        messages: {},
        pagination: {
          page: -1,
          pageCount: CHAT_PAGE_COUNT,
          lastPage: 0,
          total: CHAT_PAGE_COUNT,
        },
      };
    const newMessages = { ...this.chats[userAddress].messages, ...messages };
    this.chats[userAddress].messages = newMessages;
    this.chats[userAddress].pagination = pagination;
  }

  resetChatList() {
    Object.assign(this, initialState);
  }

  // Add other actions similarly

  // Add computed properties here if needed
}

export const messagesStore = new MessagesStore();
