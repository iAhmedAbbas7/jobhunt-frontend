// <= IMPORTS =>
import { setSavedJobs } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSavedJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    // ONLY FETCHING SAVED JOBS IF THERE IS A LOGGED IN USER
    if (!user) {
      dispatch(setSavedJobs([]));
      return;
    }
    // FETCHING ALL SAVED JOBS
    const fetchSavedJobs = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${USER_API_ENDPOINT}/savedJobs`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // ONLY GETTING JOB IDS FROM THE RESPONSE
          const savedJobIds = response.data.savedJobs.map((job) => job._id);
          // SAVING JOB IDS IN THE SAVED JOBS STATE IN AUTH SLICE
          dispatch(setSavedJobs(savedJobIds));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedJobs();
  }, [dispatch, user]);
};

export default useGetSavedJobs;
