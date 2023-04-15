import Axios from "../Axios";

export const accountServices = {
  updateInfo: async (obj) => (await Axios.put("/update", obj)).data,
  uploadImg: async (obj) => {
    const response = await Axios.post("/image", obj);
    return response;
  },
};
