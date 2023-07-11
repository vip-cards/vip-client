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

  cartOrderRequest: async (obj) => {
    return (
      await Axios.post("/orderRequest/create", { client: userId(), ...obj })
    ).data;
  },

  applyCoupon: async ({ cartId, coupon }) => {
    return (
      await Axios.post("/coupon/add", {}, { params: { cart: cartId, coupon } })
    ).data;
  },

  getOrdersRequests: async (params) => {
    return (
      await Axios.get("/orderRequest/get", {
        params: {
          ...params,
          client: userId(),
        },
      })
    ).data;
  },

  getOrdersRequest: async (params) => {
    return (
      await Axios.get("/orderRequest/get", {
        params: {
          ...params,
          client: userId(),
        },
      })
    ).data;
  },
  getOrdersRequests: async (params) => {
    return (
      await Axios.get("/orderRequest/get", {
        params: {
          ...params,
          client: userId(),
        },
      })
    ).data;
  },

  rejectOrderRequest: async (params) => {
    const response = await Axios.put(
      `/orderRequest/update`,
      {
        status: "client rejected",
      },
      {
        params: {
          client: userId(),
          ...params,
        },
      }
    );
    return response?.data?.records ?? response?.data?.record;
  },

  checkoutRequest: async (request) =>
    await Axios.post("/order/checkout", {
      client: userId(),
      request,
      status: "pending",
      purchaseDate: new Date(Date.now()),
    }),

  checkoutFreeTrial: async (request) =>
    await Axios.post("/order/freetrial", {
      client: userId(),
      request,
      status: "pending",
      purchaseDate: new Date(Date.now()),
    }),

  acceptOrder: async (request) =>
    await Axios.put(
      "/orderRequest/update",
      { status: "client accepted" },
      {
        params: {
          client: userId(),
          _id: request,
        },
      }
    ),
};
