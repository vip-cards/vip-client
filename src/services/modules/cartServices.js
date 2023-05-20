import Axios from "services/Axios";

const userId = () => localStorage.getItem("userId") ?? "";

export const cartServices = {
  /*--- CART ---*/
  getCart: async () => {
    return (
      await Axios.get("/cart/get", {
        params: {
          client: userId(),
        },
      })
    ).data;
  },

  addCartItem: async ({ branchId, productId, quantity = 1 }) => {
    return (
      await Axios.post("/cart/item", null, {
        params: {
          client: userId(),
          product: productId,
          branch: branchId,
          quantity,
        },
      })
    ).data;
  },

  removeCartItem: async ({ productId, quantity }) => {
    return (
      await Axios.delete("/cart/item", {
        params: {
          client: userId(),
          product: productId,
          quantity,
        },
      })
    ).data;
  },

  flushCart: async (cartId) => {
    return (
      await Axios.delete("/cart/flush", {
        params: {
          cart: cartId,
        },
      })
    ).data;
  },

  checkoutCart: async (obj) => {
    return (
      await Axios.post("/orderRequest/create", { client: userId(), ...obj })
    ).data;
  },

  applyCoupon: async ({ cartId, coupon }) => {
    return (
      await Axios.post("/coupon/add", {}, { params: { cart: cartId, coupon } })
    ).data;
  },
};
