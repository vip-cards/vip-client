import Axios from "./Axios";

let clientServices = {
  login: async (obj) => {
    const response = await Axios.post("/client/login", obj);
    return response;
  },

  listAllVendors: async () => {
    const response = await Axios.get(`/client/vendor/list`);
    return response;
  },

  listAllVendorBranches: async (vendorId) => {
    const response = await Axios.get(`client/branch/list/?vendor=${vendorId}`);
    return response;
  },

  getBranchDetails: async (branchId) => {
    const response = await Axios.get(`/client/branch/get?_id=${branchId}`);
    return response;
  },

  listAllBranchProductsOfType: async (branchId, isHotDeal = false) => {
    const response = await Axios.get(
      `/client/product/list?branch=${branchId}&isHotDeal=${isHotDeal}`
    );
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
};

export default clientServices;
