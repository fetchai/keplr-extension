/* eslint-disable import/no-default-export */
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    notifications: [],
    accessToken: "",
    pubAddress: "",
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setPubAddress: (state, action) => {
      state.pubAddress = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPubAddress,
  setAccessToken,
  setNotifications,
} = userSlice.actions;

export const userDetails = (state: { user: any }) => state.user;

export const userStore = userSlice.reducer;
