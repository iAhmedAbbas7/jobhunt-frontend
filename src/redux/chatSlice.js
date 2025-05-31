// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    unreadCounts: {},
    onlineUsers: [],
    lastSeen: {},
  },
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
      action.payload.forEach((r) => {
        if (state.unreadCounts[r._id] == null) {
          state.unreadCounts[r._id] = 0;
        }
      });
    },
    setUnreadCounts: (state, action) => {
      state.unreadCounts = action.payload;
    },
    incrementUnread: (state, action) => {
      const roomId = action.payload;
      state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1;
    },
    resetUnread: (state, action) => {
      const roomId = action.payload;
      state.unreadCounts[roomId] = 0;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    setRoomLastSeen: (state, action) => {
      Object.assign(state.lastSeen, action.payload);
    },
    resetChat: () => ({
      rooms: [],
      unreadCounts: {},
      onlineUsers: [],
      lastSeen: {},
    }),
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setRooms,
  setUnreadCounts,
  incrementUnread,
  resetUnread,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setRoomLastSeen,
  resetChat,
} = chatSlice.actions;

// <= EXPORTING CHAT SLICE =>
export default chatSlice.reducer;
