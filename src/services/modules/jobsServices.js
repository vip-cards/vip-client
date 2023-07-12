import Axios from "../Axios";

export const jobsServices = {
  /*--- JOBS ---*/
  listAllJobs: async (params) =>
    (await Axios.get("/job/list", { params }))?.data,

  getJobDetails: async (_id) =>
    (await Axios.get("/job/get", { params: { _id } }))?.data,

  createJob: async (body) => {
    const response = await Axios.post("/job/create", body);
    return response;
  },
  updateJob: async (body, params) => {
    const response = await Axios.put("/job/update", body, {
      params: { ...params },
    });
    return response;
  },

  applyToJob: async (_id, obj) =>
    (await Axios.post("/job/apply", obj, { params: { _id } }))?.data,

  removeJob: async (_id) =>
    (
      await Axios.delete("/job/remove", {
        params: { _id, client: localStorage.getItem("userId") ?? "" },
      })
    )?.data,
};
