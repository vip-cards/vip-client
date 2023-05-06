import Axios from "../Axios";

const userId = () => localStorage.getItem("userId") ?? "";

export const accountServices = {
  updateInfo: async (obj) => (await Axios.put("/update", obj)).data,

  uploadImg: async (obj) => {
    const response = await Axios.post("/image", obj);
    return response;
  },

  getSetting: async (key) =>
    (await Axios.get("/setting/get", { params: { key } }))?.data,

  subscribeUser: async (body) =>
    (
      await Axios.post("/subscription/subscribe?client=" + userId(), body, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    )?.data,

  listAllCoupons: async () => (await Axios.get("/coupon/list"))?.data,
};
