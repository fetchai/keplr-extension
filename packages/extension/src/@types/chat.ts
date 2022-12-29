// Params Type Definitions
export interface groupDetailsParam {
  addresses: GroupAddress[];
  createdAt: string;
  description: string;
  id: string;
  name: string;
}

export interface PublicKeyDetails {
  address: string;
  channelId: string;
  privacySetting: string;
  publicKey: string;
}

export interface NewMessageUpdate {
  type: string;
  message: Message;
}

// Graphql Type Definitions
export interface Message {
  id: string;
  sender: string;
  target: string;
  contents: string;
  groupId: string;
  expiryTimestamp: string;
  commitTimestamp: string;
}

export interface GroupAddress {
  address: string;
  pubKey: string;
  lastSeenTimestamp: string;
  groupLastSeenTimestamp: string;
  encryptedSymmetricKey: string;
  isAdmin: boolean;
}

export interface Group {
  id: string; // groupID
  name: string; // contactAddress
  isDm: boolean;
  addresses: GroupAddress[];
  lastMessageContents: string;
  lastMessageSender: string;
  lastMessageTimestamp: string;
  lastSeenTimestamp: string;
  description?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  pageCount: number;
  total: number;
  lastPage: number;
}

//Redux Selectors Type Definitions
export interface Messages {
  [key: string]: Message;
}

export interface Chat {
  contactAddress: string;
  messages: Messages;
  pubKey?: string;
  pagination: Pagination;
}

//key is group ID
export interface Chats {
  [key: string]: Chat;
}

export interface BlockedAddressState {
  [key: string]: boolean;
}

export interface Groups {
  [contactAddress: string]: Group;
}

export interface NameAddress {
  [key: string]: string;
}
