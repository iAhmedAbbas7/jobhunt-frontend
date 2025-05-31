// <= IMPORTS =>
import { setAdminCompanies } from "@/redux/companySlice";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminCompanies = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // GETTING ALL ADMIN COMPANIES FUNCTION
    const getAllAdminCompanies = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${COMPANY_API_ENDPOINT}/getAdminCompanies`,
          {
            withCredentials: true,
          }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING JOBS IN THE JOB SLICE
          dispatch(setAdminCompanies(response.data.companies));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAllAdminCompanies();
  }, [dispatch]);
  // FORWARDING LOADING STATE UNTIL REQUEST COMPLETES
  return { loading };
};

export default useGetAllAdminCompanies;
