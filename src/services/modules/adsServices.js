import Axios from "../Axios";

export const adsServices = {
  /*--- ADS ---*/
  createAd: async (obj) => (await Axios.post("ad/create", obj)).data,
  getAd: async (params) => (await Axios.get("ad/get", { params })).data,
  getBannerDetails: async (ad) =>
    (await Axios.get("banner/get", { params: { ad } })).data,
  removeAd: async (_id) =>
    (await Axios.delete("ad/remove", { params: { _id } })).data,
  updateAd: async (obj, _id) =>
    (await Axios.put("ad/update", { ...obj }, { params: { _id } })).data,
  listAllAds: async (params) => (await Axios.get("ad/list", { params })).data,
  uploadAdImg: async (id, imgFormData) =>
    (await Axios.post(`ad/image?_id=${id}`, imgFormData)).data,
};
