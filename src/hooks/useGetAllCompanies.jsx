// <= IMPORTS =>
import { setAllCompanies } from "@/redux/companySlice";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  // DISPATCH
  const dispatch = useDispatch();
  useEffect(() => {
    // GETTING ALL COMPANIES FUNCTION
    const getAllCompanies = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${COMPANY_API_ENDPOINT}/getAllCompanies`
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING COMPANIES IN THE COMPANY SLICE
          dispatch(setAllCompanies(response.data.companies));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
