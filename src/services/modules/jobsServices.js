import Axios from "../Axios";

export const jobsServices = {
  /*--- JOBS ---*/
  listAllJobs: async (params) =>
    (await Axios.get("/job/list", { params }))?.data,

  getJobDetails: async (_id) => {
    const response = await Axios.get("/job/get", {
      params: { _id },
    });
    return response;
  },

  createJob: async (body) => {
    const response = await Axios.post("/job/create", body);
    return response;
  },
};
