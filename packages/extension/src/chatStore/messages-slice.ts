/* eslint-disable import/no-default-export */
import { createSlice } from "@reduxjs/toolkit";

/**
 * Structure of slice:
 * "contact" :{
 * messageList:{}
 * lastMessage:{}
 * }
 *
 */

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {
    addMessageList: (_state, action) => action.payload,
    updateAuthorMessages: (state: any, action) => {
      const { sender, id } = action.payload;
      state[sender].messages[id] = action.payload;
      state[sender].lastMessage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMessageList, updateAuthorMessages } = messagesSlice.actions;

export const userMessages = (state: { messages: any }) => state.messages;

export const messageStore = messagesSlice.reducer;
