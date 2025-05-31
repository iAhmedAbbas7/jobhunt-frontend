// <= IMPORTS =>
import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  useEffect(() => {
    // GETTING ALL JOBS FUNCTION
    const getAllJobs = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${JOB_API_ENDPOINT}/getAllJobs`);
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING JOBS IN THE JOB SLICE
          dispatch(setAllJobs(response.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
