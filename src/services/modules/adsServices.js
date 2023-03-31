import Axios from "../Axios";

export const adsServices = {
  /*--- ADS ---*/
  createAd: async (obj) => (await Axios.post("ad/create", obj)).data,
  getAd: async (params) => (await Axios.get("ad/get", { params })).data,
  listAllAds: async () => (await Axios.get("ad/list")).data,
  uploadAdImg: async (id, imgFormData) =>
    (await Axios.post(`ad/image?_id=${id}`, imgFormData)).data,
};
