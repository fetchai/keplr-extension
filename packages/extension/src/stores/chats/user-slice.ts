import { createSlice } from "@reduxjs/toolkit";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../config.ui.var";

const initialState = {
  notifications: [],
  accessToken: "",
  messagingPubKey: {
    publicKey: null,
    privacySetting: null,
    chatReadReceiptSetting: true,
  },
  isChatActive: true,
  isAgentActive: true,
  requiredFET: 0,
  currentFET: 0,
  enabledChainIds: [CHAIN_ID_FETCHHUB, CHAIN_ID_DORADO],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetUser: (_state, _action) => initialState,
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setMessagingPubKey: (state, action) => {
      state.messagingPubKey = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setIsChatActive: (state, action) => {
      state.isChatActive = action.payload;
    },
    setIsAgentActive: (state, action) => {
      state.isAgentActive = action.payload;
    },
    setRequiredFET: (state, action) => {
      state.requiredFET = action.payload;
    },
    setCurrentFET: (state, action) => {
      state.currentFET = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  resetUser,
  setMessagingPubKey,
  setAccessToken,
  setNotifications,
  setIsChatActive,
  setCurrentFET,
} = userSlice.actions;

export const userDetails = (state: { user: any }) => state.user;
export const userChatActive = (state: { user: any }) => state.user.isChatActive;

export const userStore = userSlice.reducer;
