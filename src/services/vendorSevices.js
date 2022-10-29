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
};

export default vendorServices;
