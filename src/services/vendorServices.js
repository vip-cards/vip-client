import Axios from "./Axios";

let vendorServices = {
  login: async (obj) => {
    const response = await Axios.post("/vendor/login", obj);
    return response;
  },

  listBranches: async (id = "", page = "1", limit = 8) => {
    const response = await Axios.get(
      `/vendor/branch/list?vendor=${id}&page=${page}&limit=${limit}`
    );
    return response;
  },

  listAllBranches: async (id = "") => {
    const response = await Axios.get(`/vendor/branch/list?vendor=${id}`);
    return response;
  },

  listAllCategories: async () => {
    const response = await Axios.get(`/vendor/category/list`);
    return response;
  },

  listAllBranchProductsOfType: async (
    vendorId = "",
    branchId = "",
    isHotDeal = false
  ) => {
    const response = await Axios.get(
      `/vendor/product/list?vendor=${vendorId}&branch=${branchId}&isHotDeal=${isHotDeal}`
    );
    return response;
  },

  listAllVendorProductsOfType: async (vendorId = "", isHotDeal = false) => {
    const response = await Axios.get(
      `/vendor/product/list?vendor=${vendorId}&isHotDeal=${isHotDeal}`
    );
    return response;
  },

  createBranch: async (obj) => {
    const response = await Axios.post(`/vendor/branch/create`, obj);
    return response;
  },

  addBranchImg: async (id, obj) => {
    const response = await Axios.post(`/vendor/branch/image?_id=${id}`, obj);
    return response;
  },

  getBranchDetails: async (branchId, vendorId) => {
    const response = await Axios.get(
      `vendor/branch/get?_id=${branchId}&vendor=${vendorId}`
    );
    return response;
  },

  getOfferDetails: async (branchId, vendorId, offerId) => {
    const response = await Axios.get(
      `/vendor/product/get?branch=${branchId}&vendor=${vendorId}&_id=${offerId}`
    );
    return response;
  },

  editOfferDetails: async (offerId, branchId, vendorId, obj) => {
    const response = await Axios.put(
      `/vendor/product/update?_id=${offerId}&branch=${branchId}&vendor=${vendorId}`,
      obj
    );
    return response;
  },

  editBranchDetails: async (branchId, vendorId, obj) => {
    const response = await Axios.put(
      `vendor/branch/update?_id=${branchId}&vendor=${vendorId}`,
      obj
    );
    return response;
  },

  createOffer: async (obj) => {
    const response = await Axios.post(`/vendor/product/create`, obj);
    return response;
  },

  addOfferImg: async (id, obj) => {
    const response = await Axios.post(`/vendor/product/image?_id=${id}`, obj);
    return response;
  },
};

export default vendorServices;
