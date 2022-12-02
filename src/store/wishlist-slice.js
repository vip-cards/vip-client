import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientServices from "../services/clientServices";

/* get */
export const fetchWishList = createAsyncThunk(
  "wishList/all",
  async (_, thunkAPI) => {
    const { data } = await clientServices.listAllWishProducts();
    console.log(data.record);
    return data.record.items;
  }
);

/* add */
export const addWishProduct = createAsyncThunk(
  "wishList/add",
  async (productId, thunkAPI) => {
    const { data } = await clientServices.addWishProduct(productId);
    console.log(data.record);
    return data.record.items;
  }
);

/* remove */
export const removeWishProduct = createAsyncThunk(
  "wishList/remove",
  async (productId, thunkAPI) => {
    const { data } = await clientServices.removeWishProduct(productId);
    console.log(data.record);
    return data.record.items;
  }
);

const initialState = { products: [], ids: [] };

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWishList.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.ids = payload.map((product) => product && product._id);
    });
    builder.addCase(addWishProduct.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.ids = payload.map((product) => product && product._id);
    });
    builder.addCase(removeWishProduct.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.ids = payload.map((product) => product && product._id);
    });
  },
});

export default wishListSlice.reducer;
