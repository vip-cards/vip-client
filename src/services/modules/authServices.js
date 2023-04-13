import Axios from "../Axios";

export const authServices = {
  /*--- AUTH ---*/
  register: async (obj) => {
    const response = await Axios.post("/register", obj);
    return response;
  },
  login: async (obj) => {
    const response = await Axios.post("/login", obj);
    return response;
  },
  loginBy: async (obj) => {
    const response = await Axios.post("/loginBy", obj);
    return response;
  },

  recoveryCode: async (obj) => {
    console.log(obj);
    const { data } = await Axios.post("/recovery", obj);
    console.log(data);
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
