import { axiosAuthMiddleware } from "services/Axios";

var { axiosWrapper, userId } = axiosAuthMiddleware();

export const cartServices = {
  /*--- CART ---*/
  getCart: async () => {
    const api = await axiosWrapper();
    return (
      await api.get("/cart/get", {
        params: {
          client: userId,
        },
      })
    ).data;
  },

  addCartItem: async ({ branchId, productId, quantity = 1 }) => {
    const api = await axiosWrapper();

    return (
      await api.post("/cart/item", null, {
        params: {
          client: userId,
          product: productId,
          branch: branchId,
          quantity,
        },
      })
    ).data;
  },

  removeCartItem: async ({ productId, quantity }) => {
    const api = await axiosWrapper();

    return (
      await api.delete("/cart/item", {
        params: {
          client: userId,
          product: productId,
          quantity,
        },
      })
    ).data;
  },

  flushCart: async (cartId) => {
    const api = await axiosWrapper();

    return (
      await api.delete("/cart/flush", {
        params: {
          cart: cartId,
        },
      })
    ).data;
  },
};
