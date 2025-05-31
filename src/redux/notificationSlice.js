// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action) => {
      // CHECKING IF SENT NOTIF ID MATCHES THE NOTIFS SAVED IN STATE
      state.notifications = state.notifications.map((notif) =>
        notif._id === action.payload ? { ...notif, isRead: true } : notif
      );
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setNotifications,
  addNotification,
  clearNotifications,
  markNotificationAsRead,
} = notificationSlice.actions;

// <= EXPORTING NOTIFICATION SLICE =>
export default notificationSlice.reducer;
