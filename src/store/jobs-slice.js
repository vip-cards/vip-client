import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

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

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default jobsSlice.reducer;
