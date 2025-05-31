// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [],
    searchApplicantsByName: "",
  },
  reducers: {
    setApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    clearApplicants: (state) => {
      state.applicants = [];
    },
    setSearchApplicantsByName: (state, action) => {
      state.searchApplicantsByName = action.payload;
    },
    updateApplicantStatus: (state, action) => {
      const { id, status } = action.payload;
      if (state.applicants.applications) {
        state.applicants.applications = state.applicants.applications.map(
          (application) => {
            if (application._id === id) {
              return { ...application, status };
            }
            return application;
          }
        );
      }
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setApplicants,
  clearApplicants,
  setSearchApplicantsByName,
  updateApplicantStatus,
} = applicationSlice.actions;

// <= EXPORTING APPLICATION SLICE =>
export default applicationSlice.reducer;
