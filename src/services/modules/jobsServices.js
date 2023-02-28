import Axios from "../Axios";

export const jobsServices = {
  /*--- JOBS ---*/
  listAllJobs: async ({ page, list }) => {
    const response = await Axios.get("/job/list", {
      params: { page, list },
    });
    return response;
  },
  createJob: async (body) => {
    const response = await Axios.post("/job/create", body);
    return response;
  },
};
