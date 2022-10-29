import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    userRole: localStorage.getItem("userRole"),
  },
  reducers: {
    login(state, action) {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userRole", action.payload.userRole);

      state.token = localStorage.getItem("token");
      state.userId = localStorage.getItem("userId");
      state.userRole = localStorage.getItem("userRole");
    },

    logout(state) {
      state.token = localStorage.getItem("token");
      state.userId = localStorage.getItem("userId");
      state.userRole = localStorage.getItem("userRole");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
