import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import wishlistReducer from "./wishlist-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wishList: wishlistReducer,
  },
});

export default store;
