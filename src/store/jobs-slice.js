import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import clientServices from "../services/clientServices";

export const apiStates = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const initialState = {
  allJobs: {
    created: dayjs().toISOString(),
    items: [],
    fetchState: apiStates.IDLE,
  },
  createdJobs: {
    created: dayjs().toISOString(),
    items: [],
    fetchState: apiStates.IDLE,
  },
};

export const getCreatedJobsThunk = createAsyncThunk(
  "jobs/created",
  async (params, thunkAPI) => {
    const response = await clientServices.listAllJobs({
      ...params,
      client: localStorage.getItem("userId"),
    });
    return response.data;
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCreatedJobsThunk.fulfilled, (state, action) => {
      state.createdJobs = {
        ...state.createdJobs,
        created: dayjs().toISOString(),
        items: action.payload.records,
        fetchState: apiStates.SUCCESS,
      };
    });
    builder.addCase(getCreatedJobsThunk.pending, (state, action) => {
      state.createdJobs = {
        ...state.createdJobs,
        fetchState: apiStates.LOADING,
      };
    });
    builder.addCase(getCreatedJobsThunk.rejected, (state, action) => {
      state.createdJobs = {
        ...state.createdJobs,
        fetchState: apiStates.ERROR,
      };
    });
  },
});

export default jobsSlice.reducer;
