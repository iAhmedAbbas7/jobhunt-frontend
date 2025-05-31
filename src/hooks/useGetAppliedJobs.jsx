// <= IMPORTS =>
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  useEffect(() => {
    // FETCHING ALL APPLIED JOBS
    const fetchAppliedJobs = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESSFUL
        if (response.data.success) {
          // SETTING APPLIED JOBS IN THE JOB SLICE
          dispatch(setAllAppliedJobs(response.data.applications));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
