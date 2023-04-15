import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";
import toastPopup from "../helpers/toastPopup";
import clientServices from "../services/clientServices";

/* get */
export const fetchWishlist = createAsyncThunk(
  "wishlist/all",
  async (_, thunkAPI) => {
    const data = await clientServices.listAllWishProducts();
    return data.record.items;
  }
);

/* add */
export const addWishProduct = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      const data = await clientServices.addWishProduct(productId);

      if (data.record) {
        toastPopup.success(t("addedToWishlist"));
      }
      return data.record.items;
    } catch (err) {
      toastPopup.error(err.response.data);
      return thunkAPI.rejectWithValue({ ...err.response.data });
    }
  }
);

/* remove */
export const removeWishProduct = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkAPI) => {
    const data = await clientServices.removeWishProduct(productId);
    toastPopup.success(t("removedFromWishlist"));
    thunkAPI.dispatch(fetchWishlist());
    return data.record.items;
  }
);

const initialState = { products: [], ids: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, { payload }) => {
      if (!payload) return state;
      
      state.products = payload;
      state.ids = payload.map((product) => product && product?.product._id);
    });
    builder.addCase(addWishProduct.fulfilled, (state, { payload }) => {
      if (!payload) return state;
      state.products = payload;
      state.ids = payload.map((product) => product && product?.product._id);
    });
    builder.addCase(removeWishProduct.fulfilled, (state, { payload }) => {
      if (!payload) return state;
      state.products = payload;
      state.ids = payload.map((product) => product && product?.product._id);
    });
  },
});

export default wishlistSlice.reducer;
