import { API } from "constants/endpoints";
import Axios from "../Axios";

export const servicesServices = {
  createService: async (obj) =>
    (await Axios.post(API.SERVICES.CREATE, obj))?.data,

  removeService: async (_id) => {
    const provider = localStorage.getItem("userId") ?? "";

    return (
      await Axios.delete(API.SERVICES.REMOVE, { params: { _id, provider } })
    )?.data;
  },

  getService: async (_id) =>
    (await Axios.get(API.SERVICES.GET, { params: { _id } }))?.data,

  listAllServices: async (params) =>
    (await Axios.get(API.SERVICES.LSIT, { params }))?.data,

  updateService: async (_id, obj) =>
    (
      await Axios.put(API.SERVICES.UPDATE, obj, {
        params: { _id, provider: localStorage.getItem("userId") },
      })
    )?.data,
};
