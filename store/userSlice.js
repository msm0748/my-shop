import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    getUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setUserLogOut: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getUserInfo, setUserLogOut } = user.actions;

export default user;
