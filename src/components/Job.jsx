// <= IMPORTS =>
import { Bookmark, Building, InfoIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import { setSavedJobs, setUser } from "@/redux/authSlice";

const Job = ({ job }) => {
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // USER CREDENTIALS
  const { savedJobs } = useSelector((store) => store.auth);
  // CHECKING IF THE JOB IS ALREADY SAVED IN THE USER JOBS
  const isJobSaved = savedJobs?.some(
    (savedJobId) => savedJobId.toString() === job._id.toString()
  );
  // HANDLE SAVE TOGGLE FUNCTION
  const handleSaveToggle = async () => {
    try {
      // IF JOB IS ALREADY SAVED
      if (isJobSaved) {
        // MAKING REQUEST - (UN-SAVING THE JOB)
        const response = await axios.delete(
          `${JOB_API_ENDPOINT}/unsaveJob/${job._id}`,
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // TOASTING SUCCESS MESSAGE
          toast.success(response.data.message);
          // UPDATING THE SAVED JOBS IN THE AUTH SLICE
          dispatch(setSavedJobs(response.data.user.savedJobs));
          // SAVING THE UPDATED USER IN THE AUTH SLICE
          dispatch(setUser(response.data.user));
        }
      } else {
        // MAKING REQUEST - (SAVING THE JOB)
        const response = await axios.post(
          `${JOB_API_ENDPOINT}/saveJob/${job._id}`,
          {},
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // TOASTING SUCCESS MESSAGE
          toast.success(response.data.message);
          // UPDATING THE SAVED JOBS IN THE AUTH SLICE
          dispatch(setSavedJobs(response.data.user.savedJobs));
          // SAVING THE UPDATED USER IN THE AUTH SLICE
          dispatch(setUser(response.data.user));
        }
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    }
  };
  // JOB TIME CREATION CONVERTER FUNCTION
  const daysAgoFunction = (createdAt) => {
    const creationDate = new Date(createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - creationDate;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };
  return (
    // JOB CARD MAIN WRAPPER
    <section className="w-full flex items-center justify-start flex-col gap-[1rem] border-2 border-gray-200 bg-gray-50 rounded-lg p-[1rem] shadow-lg tracking-[0.5px]">
      {/* TIMESTAMP & BOOKMARK BUTTON */}
      <div className="w-full flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          {daysAgoFunction(job?.createdAt) === 0 && "Posted Today"}
          {daysAgoFunction(job?.createdAt) > 1 &&
            `${daysAgoFunction(job?.createdAt)} Days Ago`}
          {daysAgoFunction(job?.createdAt) === 1 && "1 Day Ago"}
        </span>
        {user && (
          <Button
            title={isJobSaved ? "Unsave" : "Save"}
            onClick={handleSaveToggle}
            variant="outline"
            size="icon"
            className={`p-[1rem] rounded-full text-white hover:text-white ${
              isJobSaved
                ? "bg-color-DB hover:bg-color-LB"
                : "bg-color-LB hover:bg-color-DB"
            }`}
          >
            <Bookmark />
          </Button>
        )}
      </div>
      {/* COMPANY NAME & AVATAR */}
      <div className="w-full flex items-center gap-[1rem]">
        <Link
          to={
            user ? `/companies/description/${job?.company?._id}` : "/redirect"
          }
          state={{ company: job?.company }}
        >
          <Avatar className="w-[54px] h-[54px] rounded-none">
            <AvatarImage
              src={job?.company?.logo}
              alt="Logo"
              className="w-[54px] h-[54px]"
            />
          </Avatar>
        </Link>
        <div>
          <h1 className="font-[600] text-[1.25rem] text-color-DB">
            {job?.company?.name}
          </h1>
          <span className="text-muted-foreground">{job?.location}</span>
        </div>
      </div>
      {/* JOB TITLE & DESCRIPTION */}
      <div className="w-full">
        <h1 className="text-[1.5rem] text-color-MAIN font-[600]">
          {job?.title}
        </h1>
        <p className="text-gray-500 text-[0.85rem]">{job?.description}</p>
      </div>
      {/* JOB DETAILS */}
      <div className="w-full flex items-center gap-[1.5rem]">
        <Badge className="bg-color-LB text-white border-none hover:bg-color-LB focus:outline-none outline-none rounded-full font-medium px-2">
          {job?.position === 1 ? "1 Position" : `${job?.position} Positions`}
        </Badge>
        <Badge className="bg-color-DB text-white border-none hover:bg-color-DB focus:outline-none outline-none rounded-full font-medium px-2">
          {job?.jobType}
        </Badge>
        <Badge className="bg-color-MAIN text-white border-none hover:bg-color-MAIN focus:outline-none outline-none rounded-full font-medium px-2">
          {job?.salary} LPA
        </Badge>
      </div>
      {/* BUTTONS */}
      <div className="w-full flex items-center gap-[1rem] mt-[1rem]">
        <Link to={user ? `/jobs/description/${job?._id}` : "/redirect"}>
          <Button
            title="Job Detail"
            className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-sm font-medium"
          >
            <InfoIcon /> Job
          </Button>
        </Link>
        <Link
          to={
            user ? `/companies/description/${job?.company?._id}` : "/redirect"
          }
          state={{ company: job?.company }}
        >
          <Button
            title="Company Detail"
            className="bg-color-MAIN outline-none border-none focus:outline-none hover:bg-color-LBR text-sm font-medium"
          >
            <Building /> Company
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Job;
