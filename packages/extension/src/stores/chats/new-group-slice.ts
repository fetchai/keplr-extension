import { GroupDetails } from "@chatTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: GroupDetails = {
  contents: "",
  description: "",
  // groupId: "",
  members: [],
  name: "",
  onlyAdminMessages: false,
};

export const newGroupSlice = createSlice({
  name: "newGroup",
  initialState: initialState,
  reducers: {
    resetNewGroup: () => initialState,
    setNewGroupInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetNewGroup, setNewGroupInfo } = newGroupSlice.actions;

export const newGroupDetails = (state: { newGroup: any }) => state.newGroup;

export const newGroupStore = newGroupSlice.reducer;
