import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../graphQL/messages-queries";

export interface MessageMap {
  [key: string]: Message;
}

interface ContactState {
  messageList: MessageMap;
  lastMessage?: Message;
  pubKey?: string;
  isBlocked?: boolean;
}

interface State {
  [key: string]: ContactState;
}

interface PubKey {
  contact: string;
  value: string;
}

const initialState: State = {};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessageList: (_state, action) => action.payload,
    updateAuthorMessages: (state: any, action: PayloadAction<Message>) => {
      const { sender, id } = action.payload;
      state[sender].messages[id] = action.payload;
      state[sender].lastMessage = action.payload;
    },
    updateSenderMessages: (state: any, action: PayloadAction<Message>) => {
      const { target, id } = action.payload;
      if (!state[target]) {
        state[target] = {
          messages: {},
          lastMessage: {},
        };
      }
      state[target].messages[id] = action.payload;
      state[target].lastMessage = action.payload;
    },
    setAuthorPubKey: (state, action: PayloadAction<PubKey>) => {
      const { contact, value } = action.payload;
      state[contact].pubKey = value;
    },
    setBlockedList: (state, action) => {
      const blockedList = action.payload;
      blockedList.map(({ blockedAddress }: { blockedAddress: string }) => {
        if (state[blockedAddress]) state[blockedAddress].isBlocked = true;
        else
          state[blockedAddress] = {
            isBlocked: true,
            messageList: {},
          };
      });
    },
    setBlockedUser: (state, action) => {
      const { blockedAddress } = action.payload;
      if (state[blockedAddress]) state[blockedAddress].isBlocked = true;
      else
        state[blockedAddress] = {
          isBlocked: true,
          messageList: {},
        };
    },
    setUnblockedUser: (state, action) => {
      const { blockedAddress } = action.payload;
      if (state[blockedAddress]) state[blockedAddress].isBlocked = false;
      else
        state[blockedAddress] = {
          isBlocked: false,
          messageList: {},
        };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addMessageList,
  updateAuthorMessages,
  updateSenderMessages,
  setAuthorPubKey,
  setBlockedList,
  setBlockedUser,
  setUnblockedUser,
} = messagesSlice.actions;

export const userMessages = (state: any) => state.messages;

export const messageStore = messagesSlice.reducer;
