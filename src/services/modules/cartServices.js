import { axiosAuthMiddleware } from "services/Axios";

var { axiosWrapper, userId } = axiosAuthMiddleware();

export const cartServices = {
  /*--- CART ---*/
  getCart: async () =>
    (
      await axiosWrapper().get("/cart/get", {
        params: {
          client: userId,
        },
      })
    ).data,

  addCartItem: async ({ branchId, productId, quantity = 1 }) =>
    (
      await axiosWrapper().post("/cart/item", null, {
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
      await axiosWrapper().delete("/cart/item", {
        params: {
          client: userId,
          product: productId,
          quantity,
        },
      })
    ).data,

  flushCart: async (cartId) =>
    (
      await axiosWrapper().delete("/cart/flush", {
        params: {
          cart: cartId,
        },
      })
    ).data,
};
