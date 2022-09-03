import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice.js";

export default configureStore({
  reducer: {
    user: user.reducer,
  },
});
