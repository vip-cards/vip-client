import toastPopup from "helpers/toastPopup";
import { guestAxios } from "../Axios";
import { clearEmpty } from "helpers";

export const authServices = {
  /*--- AUTH ---*/
  register: async (obj) => {
    const _obj = clearEmpty(obj);
    const response = await guestAxios.post("/register", _obj);
    return response;
  },
  loginBy: async (obj) => {
    try {
      const response = await guestAxios.post("/loginBy", obj);
      return response;
    } catch (e) {
      toastPopup.error(e?.response?.data?.error ?? "something went wrong");
    }
  },
  loginByTwitter: async (obj) => {
    try {
      const response = await guestAxios.post("/loginByTwitter", obj);
      return response;
    } catch (e) {
      toastPopup.error(e?.response?.data?.error ?? "something went wrong");
    }
  },
  login: async (obj) => {
    const isEmail = obj.emailOrPhone.includes("@");
    const userKey = isEmail ? "email" : "phone";

    const user = {
      [userKey]: obj.emailOrPhone,
      password: obj.password,
    };

    const response = await guestAxios.post(
      isEmail ? "/login" : "/loginByPhone",
      user
    );

    return response;
  },

  loginByCode: async (barcode) => {
    const response = await guestAxios.post("/loginByBarcode", { barcode });
    return response;
  },

  loginAsGuest: async (obj) => {
    const response = await guestAxios.get("/guest", obj);
    return response;
  },

  recoveryCode: async (obj) => {
    const { data } = await guestAxios.post("/recovery", obj);
    return data;
  },

  resetPassword: async (obj, token) => {
    const { data } = await guestAxios.put("/resetPassword", obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
