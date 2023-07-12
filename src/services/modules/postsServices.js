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
  updatePost: async (body, params) => {
    const response = await Axios.put("/post/update", body, {
      params: { ...params },
    });
    return response;
  },
  removePost: async (_id) =>
    (
      await Axios.delete("/post/remove", {
        params: { _id, client: localStorage.getItem("userId") ?? "" },
      })
    )?.data,
  applyToPost: async (_id, obj) =>
    (await Axios.post("/post/apply", obj, { params: { _id } }))?.data,
};
