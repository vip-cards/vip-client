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
};
