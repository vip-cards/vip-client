import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import wishlistReducer from "./wishlist-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
