// <= IMPORTS =>
import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // GETTING ALL ADMIN JOBS FUNCTION
    const getAllAdminJobs = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${JOB_API_ENDPOINT}/getAdminJobs`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING JOBS IN THE JOB SLICE
          dispatch(setAllAdminJobs(response.data.jobs));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAllAdminJobs();
  }, [dispatch]);
  // FORWARDING LOADING STATE UNTIL REQUEST COMPLETES
  return { loading };
};

export default useGetAllAdminJobs;
