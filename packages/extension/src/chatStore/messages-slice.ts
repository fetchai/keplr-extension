import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../graphQL/messages-queries";

export interface MessageMap {
  [key: string]: Message;
}

interface ContactState {
  messageList: MessageMap;
  lastMessage?: Message;
  pubKey?: string;
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
    updateAuthorMessages: (state: any, action: PayloadAction<Message>) => {
      const { sender, id } = action.payload;
      state[sender].messages[id] = action.payload;
      state[sender].lastMessage = action.payload;
    },
    setAuthorPubKey: (state, action: PayloadAction<PubKey>) => {
      const { contact, value } = action.payload;
      state[contact].pubKey = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAuthorMessages, setAuthorPubKey } = messagesSlice.actions;

export const userMessages = (state: any) => state.messages;

export const messageStore = messagesSlice.reducer;
