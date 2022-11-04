import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    vendorId: localStorage.getItem("vendorId"),
    branchId: localStorage.getItem("branchId"),
    userRole: localStorage.getItem("userRole"),
  },
  reducers: {
    login(state, action) {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("vendorId", action.payload.vendorId);
      localStorage.setItem("branchId", action.payload.branchId);
      localStorage.setItem("userRole", action.payload.userRole);

      state.token = localStorage.getItem("token");
      state.vendorId = localStorage.getItem("vendorId");
      state.branchId = localStorage.getItem("branchId");
      state.userRole = localStorage.getItem("userRole");
    },

    logout(state) {
      state.token = localStorage.getItem("token");
      state.vendorId = localStorage.getItem("vendorId");
      state.branchId = localStorage.getItem("branchId");
      state.userRole = localStorage.getItem("userRole");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
