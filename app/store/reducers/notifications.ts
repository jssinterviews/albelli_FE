// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../../types";

export interface NotificationState {
  value: Array<INotification>;
}

const initialState: NotificationState = {
  value: [],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    queueNotification: (state, action: PayloadAction<INotification>) => {
      state.value = [...state.value, action.payload];
    },
    dequeueNotification: (state) => {
      const [, ...rest] = state.value;
      state.value = rest;
    },
  },
});

export const { queueNotification, dequeueNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
