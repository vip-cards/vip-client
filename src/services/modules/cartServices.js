import Axios from "services/Axios";
import store from "store";

const userId = store.getState().auth.userId;

export const cartServices = {
  /*--- CART ---*/
  getCart: async () =>
    (
      await Axios.get("/cart/get", {
        params: {
          client: userId,
        },
      })
    ).data,

  addCartItem: async ({ branchId, productId, quantity = 1 }) =>
    (
      await Axios.post("/cart/item", null, {
        params: {
          client: userId,
          product: productId,
          branch: branchId,
          quantity,
        },
      })
    ).data,

  removeCartItem: async ({ productId, quantity }) =>
    (
      await Axios.delete("/cart/item", {
        params: {
          client: userId,
          product: productId,
          quantity,
        },
      })
    ).data,

  flushCart: async (cartId) =>
    (
      await Axios.delete('/cart/flush', {
        params: {
          cart: cartId,
        },
      })
    ).data,
};
