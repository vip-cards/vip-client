import Axios from "../Axios";

export const postsServices = {
  /*--- postS ---*/
  listAllPosts: async (params) =>
    (await Axios.get("/post/list", { params }))?.data,

  getPostDetails: async (_id) =>
    (await Axios.get("/post/get", { params: { _id } }))?.data,

  createPost: async (body) => {
    const response = await Axios.post("/post/create", body);
    return response;
  },

  applyToPost: async (_id, obj) =>
    (await Axios.post("/post/apply", obj, { params: { _id } }))?.data,
};
