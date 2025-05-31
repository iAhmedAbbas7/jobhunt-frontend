// <= IMPORTS =>
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Bookmark, Loader2, X } from "lucide-react";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";
import Job from "./Job";
import { setLoading } from "@/redux/authSlice";

const SavedJobs = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING LOADING STATE FROM AUTH SLICE
  const { loading } = useSelector((store) => store.auth);
  // GETTING SAVED JOBS FROM THE AUTH SLICE
  const { savedJobs } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [savedJobDetails, setSavedJobDetails] = useState([]);
  // FETCHING POPULATED SAVED JOBS
  useEffect(() => {
    const fetchSavedJobDetails = async () => {
      // LOADING STATE
      dispatch(setLoading(true));
      try {
        // MAKING REQUEST
        const response = await axios.get(`${USER_API_ENDPOINT}/savedJobs`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SAVING SAVED JOBS IN THE LOCAL STATE
          setSavedJobDetails(response.data.savedJobs);
        }
      } catch (error) {
        console.log(error);
      } finally {
        // LOADING STATE
        dispatch(setLoading(false));
      }
    };
    fetchSavedJobDetails();
  }, [savedJobs, dispatch]);
  // IF LOADING
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {/* SAVED JOBS MAIN WRAPPER */}
      <section className="w-full flex flex-col items-center justify-center gap-[2rem] sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* HEADING */}
        <div className="w-full flex items-center gap-[1rem]">
          <Bookmark className="text-color-DB w-[3rem] h-[3rem]" />
          <h1 className="font-[600] text-gray-500 text-[2rem]">
            Saved Jobs{" "}
            <span className="px-4 py-1 bg-gray-100 rounded-xl text-color-MAIN">
              {savedJobs.length}
            </span>
          </h1>
        </div>
        {/* SAVED JOBS */}
        {savedJobs.length === 0 ? (
          <div className="w-full flex items-center justify-start">
            <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
              <X /> No Saved Jobs Available
            </span>
          </div>
        ) : (
          <div className="w-full grid xl:grid-cols-3 lg:grid-cols-3 md-grid-cols-2 sm-grid-cols-1 grid-cols-1 gap-[1rem]">
            {savedJobDetails.map((job, index) => (
              <div key={index}>
                <Job job={job} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default SavedJobs;
