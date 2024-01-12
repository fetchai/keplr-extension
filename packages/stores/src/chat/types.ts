export interface NotyphiOrganisations {
  [key: string]: NotyphiOrganisation;
}
export interface NotyphiOrganisation {
  id: string;
  name: string;
  logo_href: string;
  follow: boolean;
}

export interface NotyphiTopic {
  name: string;
}

export interface NotyphiNotifications {
  [key: string]: NotyphiNotification;
}

export interface NotyphiNotification {
  delivery_id: string;
  title: string;
  content: string;
  cta_title: string;
  cta_url: string;
  delivered_at: Date;
  read_at: Date;
  clicked_at: Date;
  rejected_at: Date;
  organisation_name: string;
  image_url: string;
}

export interface NotificationSetup {
  unreadNotification: boolean;
  isNotificationOn: boolean;
  organisations: NotyphiOrganisations;
  allNotifications: NotyphiNotification[];
}

export interface NewGroupDetails {
  isEditGroup: boolean;
  group: GroupDetails;
}
export interface GroupDetails {
  contents: string;
  description: string;
  groupId: string;
  members: GroupMembers[];
  name: string;
  onlyAdminMessages: boolean;
}

export interface GroupMembers {
  address: string;
  pubKey: string;
  encryptedSymmetricKey: string;
  isAdmin: boolean;
}

export interface GroupMessagePayload {
  message: string;
  type: string;
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
  removedAt: Date;
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
  removedAt: Date;
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

export enum GroupChatOptions {
  groupInfo,
  muteGroup,
  leaveGroup,
  deleteGroup,
  chatSettings,
}

export enum GroupChatMemberOptions {
  addToAddressBook,
  viewInAddressBook,
  messageMember,
  removeMember,
  removeAdminStatus,
  makeAdminStatus,
  dissmisPopup,
}

export enum CommonPopupOptions {
  cancel,
  ok,
}
//proposal
export interface ProposalType {
  proposal_id: string;
  content: {
    type: string;
    title: string;
    description: string;
    changes: [
      {
        subspace: string;
        key: string;
        value: string;
      }
    ];
  };
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  submit_time: Date;
  deposit_end_time: Date;
  total_deposit: [
    {
      denom: string;
      amount: string;
    }
  ];
  voting_start_time: Date;
  voting_end_time: Date;
}

export interface ProposalSetup {
  votedProposals: ProposalType[];
  activeProposals: ProposalType[];
  closedProposals: ProposalType[];
}
