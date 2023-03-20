import { createSlice } from "@reduxjs/toolkit";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../config.ui.var";

export interface WalletConfig {
  notiphyWhitelist: string[];
  fetchbotActive: boolean;
  requiredNative: boolean;
}

const initialState = {
  notifications: [],
  accessToken: "",
  walletConfig: {
    notiphyWhitelist: [],
    fetchbotActive: false,
    requiredNative: true,
  } as WalletConfig,
  messagingPubKey: {
    publicKey: null,
    privacySetting: null,
    chatReadReceiptSetting: true,
  },
  isChatActive: true,
  showAgentDisclaimer: true,
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
    setShowAgentDisclaimer: (state, action) => {
      state.showAgentDisclaimer = action.payload;
    },
    setWalletConfig: (state, action) => {
      state.walletConfig = action.payload;
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
  setShowAgentDisclaimer,
  setWalletConfig,
} = userSlice.actions;

export const userDetails = (state: { user: any }) => state.user;
export const userChatActive = (state: { user: any }) => state.user.isChatActive;
export const walletConfig = (state: { user: any }) => state.user.walletConfig;

export const userStore = userSlice.reducer;
