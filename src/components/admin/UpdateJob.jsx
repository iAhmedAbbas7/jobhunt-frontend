// <= IMPORTS =>
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { ArrowLeftCircle, Briefcase, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";

const UpdateJob = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOCATION
  const location = useLocation();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // GETTING JOB  FROM LOCATION STATE
  const { job } = location.state || {};
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    salary: job?.salary || "",
    location: job?.location || "",
    jobType: job?.jobType || "",
    experienceLevel: job?.experienceLevel || 0,
    position: job?.position || 0,
  });
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.put(
        `${JOB_API_ENDPOINT}/update/${job._id}`,
        input,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ADMIN JOBS PAGE
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <Navbar />
      {/* UPDATE JOB MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* UPDATE JOB CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Update Job
              </h1>
            </div>
            <Button
              onClick={() => navigate("/admin/jobs")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          {/* MAIN FORM ELEMENT */}
          <form onSubmit={submitHandler} className="w-full md:w-2/3">
            {/* JOB TITLE */}
            <div className="my-[1rem]">
              <label
                htmlFor="title"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
                disabled
              />
            </div>
            {/* DESCRIPTION */}
            <div className="my-[1rem]">
              <label
                htmlFor="description"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Description
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* REQUIREMENTS */}
            <div className="my-[1rem]">
              <label
                htmlFor="requirements"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Requirements
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* SALARY */}
            <div className="my-[1rem]">
              <label
                htmlFor="salary"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Salary
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* LOCATION */}
            <div className="my-[1rem]">
              <label
                htmlFor="location"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* JOB TYPE */}
            <div className="my-[1rem]">
              <label
                htmlFor="jobType"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Job Type
              </label>
              <input
                type="text"
                id="jobType"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* EXPERIENCE */}
            <div className="my-[1rem]">
              <label
                htmlFor="experienceLevel"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Experience
              </label>
              <input
                type="number"
                id="experienceLevel"
                name="experienceLevel"
                min={0}
                value={input.experienceLevel}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              />
            </div>
            {/* POSITION */}
            <div className="my-[1rem]">
              <label
                htmlFor="position"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Positions
              </label>
              <input
                min={1}
                type="number"
                id="position"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* CREATE & LOADING BUTTON */}
            {loading ? (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Job
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                Update Job
              </Button>
            )}
          </form>
        </section>
      </section>
    </>
  );
};

export default UpdateJob;
