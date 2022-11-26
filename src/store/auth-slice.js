import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    userRole: localStorage.getItem("userRole"),
    userData: JSON.parse(localStorage.getItem("userData")),
  },
  reducers: {
    login(state, action) {
      localStorage.setItem("token", action.payload.token);

      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userRole", action.payload.userRole);
      localStorage.setItem("userData", JSON.stringify(action.payload.userData));

      state.token = localStorage.getItem("token");

      state.userId = localStorage.getItem("userId");
      state.userRole = localStorage.getItem("userRole");
      state.userData = JSON.parse(localStorage.getItem("userData"));
    },

    logout(state) {
      state.token = localStorage.getItem("token");
      state.userId = localStorage.getItem("userId");
      state.userRole = localStorage.getItem("userRole");
      state.userData = localStorage.getItem("userData");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
