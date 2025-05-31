// <= IMPORTS =>
import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSingleCompanyById = (companyId) => {
  // DISPATCH
  const dispatch = useDispatch();
  useEffect(() => {
    // GETTING SINGLE COMPANY BY ID FUNCTION
    const getSingleCompany = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${COMPANY_API_ENDPOINT}/get/${companyId}`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING SINGLE COMPANY IN THE COMPANY SLICE
          dispatch(setSingleCompany(response.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSingleCompany();
  }, [dispatch, companyId]);
};

export default useGetSingleCompanyById;
