import Axios from "services/Axios";

export const chatServices = {
  getAdmins: async () => (await Axios.get("admin/get")).data,
};
