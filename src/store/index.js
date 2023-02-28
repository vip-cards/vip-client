import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import { cartReducer } from "./cart-slice";
import jobsReducer from "./jobs-slice";
import wishlistReducer from "./wishlist-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    jobs: jobsReducer,
  },
});

export default store;
