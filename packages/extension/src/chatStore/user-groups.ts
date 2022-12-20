import { createSlice } from "@reduxjs/toolkit";
import { groupDetails } from "../@types/chat";

interface userGroups {
  [key: string]: groupDetails;
}

const initialState: userGroups = {};

export const userGroupsSlice = createSlice({
  name: "userGroups",
  initialState: initialState,
  reducers: {
    setUserGroups: (_state, _action) => initialState,
    addUserGroup: (state, action) => {
      const { id } = action.payload;
      state[id].addresses = action.payload;
    },
    updateUserGroup: (state, action) => {
      const { id } = action.payload;
      state[id] = action.payload;
    },
    addAddressToUserGroup: (state, action) => {
      const { id, address } = action.payload;
      const addresses = state[id].addresses;
      state[id].addresses = [...addresses, address];
    },
    removeAddressFromUserGroup: (state, action) => {
      const { id, address } = action.payload;
      const addresses = state[id].addresses;
      state[id].addresses = addresses.filter(
        (adrs) => adrs.address != address.address
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserGroups,
  addUserGroup,
  updateUserGroup,
  addAddressToUserGroup,
  removeAddressFromUserGroup,
} = userGroupsSlice.actions;

export const userGroups = (state: { userGroups: any }) => state.userGroups;
export const userStore = userGroupsSlice.reducer;
