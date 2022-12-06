import store from "../store";
import Axios from "./Axios";

const userId = store.getState().auth.userId;

const clientServices = {
  /*--- AUTH ---*/
  register: async (obj) => {
    const response = await Axios.post("/client/register", obj);
    return response;
  },
  login: async (obj) => {
    const response = await Axios.post("/client/login", obj);
    return response;
  },
  loginBy: async (obj) => {
    const response = await Axios.post("/client/loginBy", obj);
    return response;
  },
  updateInfo: async (obj) => {
    const response = await Axios.put("/client/update", obj);
    return response;
  },
  uploadImg: async (obj) => {
    const response = await Axios.post("/client/image", obj);
    return response;
  },

  getVendor: async (vendorId) => {
    const response = await Axios.get(`/client/vendor/get?_id=${vendorId}`);
    return response;
  },
  listAllVendors: async () => {
    const response = await Axios.get(`/client/vendor/list`);
    return response;
  },
  listAllVendorsInCategory: async (id) => {
    const response = await Axios.get(`/client/vendor/list?category=${id}`);
    return response;
  },
  getReview: async (id) => {
    const response = await Axios.get(
      `/client/review/get?_id=${id}&client=${userId}`
    );
    return response;
  },

  listClientOrders: async () => {
    const response = await Axios.get("/client/order/get?client=" + userId);
    return response;
  },

  listAllVendorBranches: async (vendorId) => {
    const response = await Axios.get(`/client/branch/list/?vendor=${vendorId}`);
    return response;
  },
  listAllVendorCategories: async (vendorId) => {
    const response = vendorId
      ? await Axios.get(`/client/category/list/?vendor=${vendorId}`)
      : await Axios.get(`/client/category/list?type=vendor`);
    return response;
  },

  listAllBanners: async () => {
    const response = await Axios.get(`/client/banner/list`);
    return response;
  },

  getBranchDetails: async (branchId) => {
    const response = await Axios.get(`/client/branch/get?_id=${branchId}`);
    return response;
  },

  /*--- PRODUCTS ---*/
  listAllBranchProductsOfType: async (branchId, isHotDeal = false) => {
    const response = await Axios.get(
      `/client/product/list?branch=${branchId}&isHotDeal=${isHotDeal}`
    );
    return response;
  },

  listAllVendorProducts: async (vendorId) => {
    const response = await Axios.get(`/client/product/list?vendor=${vendorId}`);
    return response;
  },

  listAllProductsOfType: async (isHotDeal = false) => {
    const response = await Axios.get(
      `/client/product/list?isHotDeal=${isHotDeal}`
    );
    return response;
  },

  listAllCategories: async () => {
    const response = await Axios.get(`/client/category/list`);
    return response;
  },

  /*--- WISHLIST ---*/
  listAllWishProducts: async () => {
    const response = await Axios.get(`/client/wishlist/get?client=${userId}`);
    return response;
  },
  addWishProduct: async (productId) => {
    const response = await Axios.post(
      `/client/wishlist/addItem?client=${userId}&product=${productId}`
    );
    return response;
  },
  removeWishProduct: async (productId) => {
    const response = await Axios.delete(
      `/client/wishlist/removeItem?client=${userId}&product=${productId}`
    );
    return response;
  },

  /*--- SEARCH ---*/
  vendorQuery: async (params) => {
    const response = await Axios.get(`/client/vendor/list`, {
      params,
    });
    return response;
  },
  categoryQuery: async (params) => {
    const response = await Axios.get(`/client/category/list`, {
      params,
    });
    return response;
  },
  searchOffersDeals: async (params) => {
    const response = await Axios.get(`/client/product/list`, {
      params,
    });
    return response;
  },
  searchProducts: async (params) => {
    const response = await Axios.get(`/client/product/list`, {
      params,
    });
    return response;
  },
};

export default clientServices;
