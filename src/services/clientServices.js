import store from "../store";
import Axios from "./Axios";
import { accountServices } from "./modules/accountServices";
import { adsServices } from "./modules/adsServices";
import { authServices } from "./modules/authServices";
import { cartServices } from "./modules/cartServices";
import { jobsServices } from "./modules/jobsServices";
import { postsServices } from "./modules/postsServices";
import { productsServives } from "./modules/productsServices";
import { professionsServices } from "./modules/professionsServices";
import { servicesServices } from "./modules/servicesServices";
import { wishServices } from "./modules/wishServices";

const userId = () =>
  store.getState()?.auth?.userId ?? localStorage.getItem("userId") ?? "";

const clientServices = {
  getVendor: async (vendorId) => {
    const response = await Axios.get(`/vendor/get?_id=${vendorId}`);
    return response;
  },
  listAllVendors: async (params) =>
    (await Axios.get(`/vendor/list`, { params })).data,
  listAllVendorsByRating: async (params) =>
    (await Axios.get(`/vendor/rating`, { params })).data,

  listAllVendorsInCategory: async (id) =>
    (await Axios.get(`/vendor/list?category=${id}`)).data?.records,

  getReview: async (id) => {
    const response = await Axios.get(
      `/review/get?_id=${id}&client=${userId()}`
    );
    return response;
  },

  listClientOrders: async () => {
    const response = await Axios.get("/order/get?client=" + userId());
    return response;
  },

  listAllVendorBranches: async (params) =>
    (
      await Axios.get("/branch/list/", {
        params,
      })
    )?.data,

  listNearestVendorBranches: (params) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const response = await Axios.get("/branch/nearest/", {
              params: {
                ...params,
                long: coords.longitude,
                lat: coords.latitude,
              },
            });
            resolve(response.data);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  listAllVendorCategories: async (vendorId) => {
    const response = vendorId
      ? await Axios.get(`/category/list/?vendor=${vendorId}`)
      : await Axios.get(`/category/list?type=vendor`);
    return response;
  },

  listAllBanners: async (params) =>
    (await Axios.get(`/banner/list`, { params }))?.data,

  getBranchDetails: async (branchId) => {
    const response = await Axios.get(`/branch/get?_id=${branchId}`);
    return response;
  },

  listAllCategories: async (params) =>
    (await Axios.get(`/category/list`, { params })).data,

  /*--- SEARCH ---*/
  vendorQuery: async (params) => {
    const response = await Axios.get(`/vendor/list`, {
      params,
    });
    return response;
  },
  categoryQuery: async (params) => {
    const response = await Axios.get(`/category/list`, {
      params,
    });
    return response;
  },
  searchOffersDeals: async (params) => {
    const response = await Axios.get(`/product/list`, {
      params,
    });
    return response;
  },
  searchProducts: async (params) => {
    const response = await Axios.get(`/product/list`, {
      params,
    });
    return response;
  },
  getProductReview: async (_id) => {
    const { data } = await Axios.get(`/review/list`, {
      params: { product: _id },
    });
    return data;
  },
  getVendorReview: async (_id) => {
    const { data } = await Axios.get(`/review/list`, {
      params: { vendor: _id },
    });
    return data;
  },

  createProductReview: async (body) => {
    const response = await Axios.post(`/review/create`, body);
    return response;
  },

  listAllPages: async () => {
    const response = await Axios.get(`/page/list`);
    return response?.data?.records ?? response?.data?.record;
  },

  getPage: async (_id) => {
    const response = await Axios.get(`/page/get`, { params: { _id } });
    return response?.data?.records?.[0] ?? response?.data?.record[0];
  },

  listAllSettings: async () => {
    const response = await Axios.get(`/setting/get`);
    return response?.data?.records ?? response?.data?.record;
  },

  ...accountServices,
  ...productsServives,
  ...cartServices,
  ...wishServices,
  ...authServices,
  ...jobsServices,
  ...postsServices,
  ...adsServices,
  ...professionsServices,
  ...servicesServices,
};

export default clientServices;
