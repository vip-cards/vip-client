import Axios from "services/Axios";

const userId = () => localStorage.getItem("userId") ?? "";

export const productsServives = {
  getProductDetails: async (productId) => {
    const response = await Axios.get(`/product/get?_id=${productId}`);
    return response.data;
  },
  listAllBranchProducts: async (branchId) => {
    const response = await Axios.get(`/product/list?branches=${branchId}`);
    return response;
  },

  listAllVendorProducts: async (vendorId) => {
    const response = await Axios.get(`/product/list?vendor=${vendorId}`);
    return response;
  },

  listAllProducts: async (params) =>
    (await Axios.get(`/product/list`, { params })).data,

  listAllProductsOfType: async (isHotDeal = false) => {
    const response = await Axios.get(`/product/list?isHotDeal=${isHotDeal}`);
    return response;
  },
};
