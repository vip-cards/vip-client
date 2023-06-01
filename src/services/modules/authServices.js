import toastPopup from "helpers/toastPopup";
import Axios from "../Axios";

export const authServices = {
  /*--- AUTH ---*/
  register: async (obj) => {
    const response = await Axios.post("/register", obj);
    return response;
  },
  loginBy: async (obj) => {
    try {
      const response = await Axios.post("/loginBy", obj);
      return response;
    } catch (e) {
      toastPopup.error(e?.response?.data?.error ?? "something went wrong");
    }
  },
  login: async (obj) => {
    const response = await Axios.post("/login", obj);
    return response;
  },

  loginByCode: async (barcode) => {
    const response = await Axios.post("/loginByBarcode", { barcode });
    return response;
  },

  loginAsGuest: async (obj) => {
    const response = await Axios.get("/guest", obj);
    return response;
  },

  recoveryCode: async (obj) => {
    const { data } = await Axios.post("/recovery", obj);
    return data;
  },

  resetPassword: async (obj, token) => {
    const { data } = await Axios.put("/resetPassword", obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
