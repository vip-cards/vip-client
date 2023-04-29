import Axios from "../Axios";

export const professionsServices = {
  getProfession: async (_id) =>
    (await Axios.get("/profession/get", { params: { _id } }))?.data,

  listAllProfessions: async () => (await Axios.get("/profession/list"))?.data,
  listAllInterests: async () => (await Axios.get("/interest/list"))?.data,
};
