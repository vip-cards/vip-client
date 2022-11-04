import Axios from "./Axios";

let branchServices = {
  login: async (obj) => {
    const response = await Axios.post("/branch/login", obj);
    return response;
  },

  listAllBranchProductsOfType: async (branchId = "", isHotDeal = false) => {
    const response = await Axios.get(
      `/branch/product/list?branch=${branchId}&isHotDeal=${isHotDeal}`
    );
    return response;
  },

  getBranchDetails: async (branchId, vendorId) => {
    const response = await Axios.get(`/branch/get?branch=${branchId}`);
    return response;
  },

  getOfferDetails: async (branchId, offerId) => {
    const response = await Axios.get(
      `/branch/product/get?branch=${branchId}&_id=${offerId}`
    );
    return response;
  },

  editOfferDetails: async (offerId, branchId, obj) => {
    const response = await Axios.put(
      `/branch/product/update?_id=${offerId}&branch=${branchId}`,
      obj
    );
    return response;
  },

  addOfferImg: async (id, obj) => {
    const response = await Axios.post(`/branch/product/image?_id=${id}`, obj);
    return response;
  },

  listAllCategories: async () => {
    const response = await Axios.get(`/branch/category/list`);
    return response;
  },
};

export default branchServices;
