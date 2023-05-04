import Axios from "services/Axios";

const userId = () => localStorage.getItem("userId") ?? "";

export const wishServices = {
  listAllWishProducts: async () => {
    return (
      await Axios.get(`/wishlist/get`, {
        params: { client: userId() },
      })
    ).data;
  },

  addWishProduct: async (productId) => {
    return (
      await Axios.post(`/wishlist/addItem`, null, {
        params: { client: userId(), product: productId },
      })
    )?.data;
  },

  removeWishProduct: async (productId) => {
    return (
      await Axios.delete(
        `/wishlist/removeItem?client=${userId()}&product=${productId}`
      )
    ).data;
  },
};
