/* eslint-disable import/no-default-export */
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    notifications: [],
    accessToken: "",
    pubKey: "",
    prvKey: "",
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setPubKey: (state, action) => {
      state.pubKey = action.payload;
    },
    setPrvKey: (state, action) => {
      state.prvKey = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPrvKey, setPubKey, setAccessToken, setNotifications } = userSlice.actions;

export const userDetails = (state: { user: any }) => state.user;

export const userStore = userSlice.reducer;
