// <= IMPORTS =>
import { setSearchedJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllQueryJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING SEARCHED QUERY STATE FROM JOB SLICE
  const { searchedQuery } = useSelector((store) => store.job);
  useEffect(() => {
    // AVOIDING THE HOOK FROM RUNNING IF THERE IS NO SEARCH QUERY PRESENT
    if (!searchedQuery) return;
    // GETTING ALL SEARCHED JOBS FUNCTION
    const getAllQueryJobs = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${JOB_API_ENDPOINT}/getAllJobs?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING SEARCHED JOBS IN THE JOB SLICE
          dispatch(setSearchedJobs(response.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllQueryJobs();
  }, [dispatch, searchedQuery]);
};

export default useGetAllQueryJobs;
