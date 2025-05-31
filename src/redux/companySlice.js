// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    allCompanies: [],
    allAdminCompanies: [],
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setAllCompanies: (state, action) => {
      state.allCompanies = action.payload;
    },
    setAdminCompanies: (state, action) => {
      state.allAdminCompanies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setSingleCompany,
  setAllCompanies,
  setAdminCompanies,
  setSearchCompanyByText,
} = companySlice.actions;

// <= EXPORTING COMPANY SLICE =>
export default companySlice.reducer;
