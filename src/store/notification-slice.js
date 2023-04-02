import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    count: 0,
  },

  reducers: {
    setNotifications: (state, { payload }) => {
      if (!payload.records.length && !payload.count && !payload.counts) {
        return state;
      }

      const userId = JSON.parse(localStorage.getItem("userData"))._id;
      state.list = payload.records.map((item) => {
        if (
          item.seenBy?.length &&
          item.seenBy.findIndex((item) => item === userId) > -1
        ) {
          return {
            ...item,
            seen: true,
          };
        } else {
          return {
            ...item,
            seen: false,
          };
        }
      });
      state.count = payload.counts ?? payload.count;
    },
  },

  extraReducers: (builder) => {},
});

export const { setNotifications } = notificationSlice.actions;
export const selectNotification = (state) => state.notification;

export default notificationSlice.reducer;
