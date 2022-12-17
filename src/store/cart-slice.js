import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientServices from "../services/clientServices";

/**
 * product id
 * branch id
 * quantity
 */

const initialState = { loading: false, products: [] };

export const getCurrentCartThunk = createAsyncThunk(
  "cart/get",
  async (payload, thunkAPI) => {
    const { data } = await clientServices.getCart();
    return data.record;
  }
);
export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (payload, thunkAPI) => {
    const product = {
      branchId: payload.branchId,
      productId: payload._id,
      quantity: payload.quantity,
    };

    const { data } = await clientServices.addCartItem(product);
    console.log(data);
    return data.record;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const existedProduct = state.products.find(
        (item) => item._id === payload._id
      );
      if (existedProduct) {
        existedProduct.quantity += payload.quantity;
        return state;
      }

      const product = {
        _id: payload._id,
        branch: payload.branch,
        quantity: payload.quantity,
      };
      state.products.push(product);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentCartThunk.fulfilled, (state, { payload }) => {
      state._id = payload._id;
      state.vendor = payload.vendor;
      state.products = payload.items;
      state.branch = payload.branch;
      state.price = { original: payload.originalTotal, current: payload.total };
      state.points = payload.points;
      return state;
    });

    builder.addCase(addToCartThunk.pending, (state, { payload }) => {
      state.loading = true;
      return state;
    });
 
    builder.addCase(addToCartThunk.fulfilled, (state, { payload }) => {
      console.log(payload);
      state._id = payload._id;
      state.vendor = payload.vendor;
      state.products = payload.items;
      state.branch._id = payload.branch;
      state.price = { original: payload.originalTotal, current: payload.total };
      state.points = payload.points;
    });
  },
});

export const { addToCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
