// <= IMPORTS =>
import { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Briefcase, Edit2, Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { JOB_RECOMMENDATION_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import Job from "./Job";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const JobRecommendations = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // STATE MANAGEMENT
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // FETCHING RECOMMENDED JOBS ON COMPONENT MOUNT
  useEffect(() => {
    const fetchRecommendations = async () => {
      // LOADING STATE
      dispatch(setLoading(true));
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${JOB_RECOMMENDATION_API_ENDPOINT}/jobs`,
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING RECOMMENDED JOBS
          setRecommendedJobs(response.data.jobs);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error Fetching Recommended Jobs");
      } finally {
        // LOADING STATE
        dispatch(setLoading(false));
      }
    };
    fetchRecommendations();
  }, [dispatch]);
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
      {/* JOB RECOMMENDATIONS MAIN WRAPPER */}
      <section className="w-full flex flex-col items-center justify-center gap-[2rem] sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* HEADING */}
        <div className="w-full flex items-center gap-[1rem]">
          <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
          <h1 className="font-[600] text-gray-500 text-[2rem]">
            Recommended Jobs{" "}
            <span className="px-4 py-1 bg-gray-100 rounded-xl text-color-MAIN">
              {recommendedJobs.length}
            </span>
          </h1>
        </div>
        {/* RECOMMENDED JOBS */}
        {recommendedJobs.length === 0 ? (
          <div className="w-full flex flex-col gap-[1rem] items-start justify-center">
            <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
              <X /> No Recommended Jobs at this Time
            </span>
            <h3 className="md:w-2/4 w-full bg-gray-100 p-3 rounded-lg text-gray-500">
              The Jobs Recommendation System finds the Jobs with Required Skills
              that Best Matches your Profile Skills. In Order to find Jobs that
              fits your Profile. Update your Profile with the Best Skills that
              you have.
            </h3>
            {/* EDIT PROFILE */}
            <div className="w-full flex items-center justify-start">
              <Button
                onClick={() => navigate("/profile/update")}
                className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
              >
                <Edit2 /> Edit Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full grid xl:grid-cols-3 lg:grid-cols-3 md-grid-cols-2 sm-grid-cols-1 grid-cols-1 gap-[1rem]">
            {recommendedJobs.map((job, index) => (
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

export default JobRecommendations;
