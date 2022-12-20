export interface addressDetails {
  address: string;
  encryptedSymmetricKey: string;
  isAdmin: boolean;
  lastSeenTimestamp: string;
  pubKey: string;
}

export interface groupDetails {
  addresses: addressDetails[];
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

export interface Message {
  id: string;
  sender: string;
  target: string;
  contents: string;
  groupId: string;
  expiryTimestamp: string;
  commitTimestamp: string;
}

export interface NewMessageUpdate {
  type: string;
  message: Message;
}