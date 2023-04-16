import Axios from "../Axios";

const userId = localStorage.getItem("userId") ?? "";

export const accountServices = {
  updateInfo: async (obj) => (await Axios.put("/update", obj)).data,

  uploadImg: async (obj) => {
    const response = await Axios.post("/image", obj);
    return response;
  },

  getSetting: async (key) =>
    (await Axios.get("/setting/get", { params: { key } }))?.data,

  subscribeUser: async () =>
    (await Axios.get("/subscription/subscribe", { params: { client: userId } }))
      ?.data,
};
