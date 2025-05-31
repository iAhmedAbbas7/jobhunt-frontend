// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const jobSlice = createSlice({
  name: "job",
  initialState: {
    singleJob: null,
    allJobs: [],
    allAdminJobs: [],
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    searchedJobs: [],
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setSearchedJobs: (state, action) => {
      state.searchedJobs = action.payload;
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSearchedJobs,
} = jobSlice.actions;

// <= EXPORTING JOB SLICE =>
export default jobSlice.reducer;
