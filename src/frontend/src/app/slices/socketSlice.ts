import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNotificationHubConnected: false,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setNotificationHubConnected: (state, { payload }) => {
      state.isNotificationHubConnected = payload;
    },
  },
});

export default socketSlice.reducer;

export const { setNotificationHubConnected } = socketSlice.actions;
