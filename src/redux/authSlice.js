// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    savedJobs: [],
    isLoggedIn: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.user = null;
      state.savedJobs = [];
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setLoading,
  setUser,
  setSavedJobs,
  setLoggedIn,
  clearAuthState,
} = authSlice.actions;

// <= EXPORTING AUTH SLICE =>
export default authSlice.reducer;
