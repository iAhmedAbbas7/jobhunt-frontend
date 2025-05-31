// <= IMPORTS =>
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/constants";

const useGetAllApplicants = (jobId) => {
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // FETCHING ALL APPLICANTS FUNCTION
    const fetchAllApplicants = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${jobId}/applicants`,
          { withCredentials: true }
        );
        if (response.data.success) {
          // SETTING APPLICANTS IN THE APPLICATION SLICE
          dispatch(setApplicants(response.data.job));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplicants();
  }, [dispatch, jobId]);
  // FORWARDING LOADING STATE UNTIL REQUEST COMPLETES
  return { loading };
};

export default useGetAllApplicants;
