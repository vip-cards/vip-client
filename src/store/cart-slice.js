import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import toastPopup from "../helpers/toastPopup";
import clientServices from "../services/clientServices";

/**
 * product id
 * branch id
 * quantity
 */

const initialState = { loading: false, products: [], coupon: 0 };

export const getCurrentCartThunk = createAsyncThunk(
  "cart/get",
  async (payload, thunkAPI) => {
    const data = await clientServices.getCart();

    return data.record;
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (payload, thunkAPI) => {
    const product = {
      branchId: payload.branchId,
      productId: payload._id,
      quantity: payload.quantity ?? ++payload.quantity,
    };
    try {
      const data = await clientServices.addCartItem(product);
      return data.record;
    } catch (err) {
      return thunkAPI.rejectWithValue({ ...err.response.data });
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/remove",
  async (payload, thunkAPI) => {
    const product = {
      productId: payload._id,
      quantity: payload.quantity,
    };
    const data = await clientServices.removeCartItem(product);

    if (!data.record.items.length) {
      thunkAPI.dispatch(getCurrentCartThunk());
    }

    return data.record;
  }
);

export const flushCart = createAsyncThunk(
  "cart/remove",
  async (cartId, thunkAPI) => {
    const data = await clientServices.flushCart(cartId);
    toastPopup.success("Cart cleared successfully");

    thunkAPI.dispatch(getCurrentCartThunk());

    return data.record;
  }
);

export const applyCartCouponThunk = createAsyncThunk(
  "cart/coupon",
  async ({ cartId, coupon }, thunkAPI) => {
    try {
      const data = await clientServices.applyCoupon({ cartId, coupon });
      toastPopup.success("Coupon Applied successfully");

      thunkAPI.dispatch(getCurrentCartThunk());

      return data.record;
    } catch (err) {
      return thunkAPI.rejectWithValue({ ...err.response.data });
    }
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
      state.coupon = payload.coupon;

      state.points = payload.points;

      state.loading = false;
    });

    builder.addCase(addToCartThunk.fulfilled, (state, { payload }) => {
      state._id = payload._id;
      state.vendor = payload.vendor;
      state.products = payload.items;
      state.branch = {
        ...state.branch,
        _id: payload.branch,
      };
      state.price = { original: payload.originalTotal, current: payload.total };
      state.points = payload.points;
      toastPopup.success("Product added to cart!");
      state.loading = false;
    });
    builder.addCase(addToCartThunk.rejected, (state, { payload }) => {
      toastPopup.error(payload.error);
    });
    builder.addCase(applyCartCouponThunk.rejected, (state, { payload }) => {
      toastPopup.error(payload.error);
    });

    builder.addCase(removeFromCartThunk.fulfilled, (state, { payload }) => {
      if (!payload?._id) return state;

      state._id = payload._id;
      state.vendor = payload.vendor;
      state.products = payload.items;
      state.branch = {
        ...state.branch,
        _id: payload.branch,
      };
      state.price = { original: payload.originalTotal, current: payload.total };
      state.points = payload.points;

      state.loading = false;
    });

    builder.addMatcher(
      isPending(addToCartThunk, removeFromCartThunk, applyCartCouponThunk),
      (state, { payload }) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      isRejected(addToCartThunk, removeFromCartThunk, applyCartCouponThunk),
      (state, { payload }) => {
        state.loading = false;
        return state;
      }
    );
  },
});

export const { addToCart } = cartSlice.actions;
export const selectCart = (state) => state.cart;
export const selectCartProducts = (state) => state.cart.products;
export const selectCartBranch = (state) => state.cart.branch;
export const cartReducer = cartSlice.reducer;
