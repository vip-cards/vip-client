import { createSlice } from "@reduxjs/toolkit";

if (
  localStorage.getItem("userRole") === "vendor" ||
  localStorage.getItem("userRole") === "branch"
) {
  ["token", "vendorId", "branchId", "userRole", "userData", "userId"].forEach(
    (element) => {
      localStorage.removeItem(element);
    }
  );
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") ?? "",
    userId: localStorage.getItem("userId") ?? "",
    userRole: localStorage.getItem("userRole") ?? "",
    userData: JSON.parse(localStorage.getItem("userData")) ?? "",
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

    update(state, { payload: { userData } }) {
      const userObj = {
        ...userData,
        name_en: userData.name.en,
        name_ar: userData.name.ar,
        profession_en: userData.profession.en,
        profession_ar: userData.profession.ar,
      };
      state.userData = userObj;
      localStorage.setItem("userData", JSON.stringify(userObj));
    },

    updateImage(state, { payload }) {
      state.userData.image = payload;
      localStorage.setItem("userData", JSON.stringify(state.userData));
    },

    logout(state) {
      state.token = "";
      state.userId = "";
      state.userRole = "";
      state.userData = "";
    },
  },
});

export const authActions = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectUserData = (state) => state.auth.userData;
export default authSlice.reducer;
