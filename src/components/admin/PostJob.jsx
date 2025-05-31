// <= IMPORTS =>
import { ArrowLeftCircle, Briefcase, Info, Loader2, Send } from "lucide-react";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";

const PostJob = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // GETTING ALL ADMIN COMPANIES FROM COMPANY SLICE
  const { allAdminCompanies } = useSelector((store) => store.company);
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: 0,
    position: 0,
    companyId: "",
  });
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // SELECT EVENT HANDLER
  const selectEventHandler = (value) => {
    // FINDING THE COMPANY
    const selectedCompany = allAdminCompanies.find(
      (company) => company.name.toLowerCase() === value
    );
    // PASSING THE VALUE TO THE STATE INPUT
    setInput({ ...input, companyId: selectedCompany._id });
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ADMIN JOBS ROUTE
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
      {/* POST JOB MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* POST JOB CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Create Job
              </h1>
            </div>
            <Button
              onClick={() => navigate("/admin/jobs")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          {/* INFO CAPTION */}
          {!allAdminCompanies.length && (
            <span className="flex items-center justify-center gap-[0.5rem] italic text-gray-500 text-xs sm:text-sm">
              <Info />
              <span>
                You must have a Company Registered, before Posting a Job.
              </span>
              <Link
                to={"/admin/companies/create"}
                className="text-color-DB underline underline-offset-4"
              >
                Register Company
              </Link>
            </span>
          )}
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
            {/* COMPANIES */}
            {allAdminCompanies.length !== 0 && (
              <div className="my-[1rem]">
                <label
                  htmlFor="company"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Company
                </label>
                {allAdminCompanies.length !== 0 && (
                  <Select onValueChange={selectEventHandler}>
                    <SelectTrigger className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 focus-visible:ring-offset-0 focus-visible:ring-0 focus:ring-0">
                      <SelectValue placeholder="Select a Company to Post Job" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allAdminCompanies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company?.name.toLowerCase()}
                          >
                            {company?.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            {/* CREATE & LOADING BUTTON */}
            {loading ? (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Job
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Send />
                Post Job
              </Button>
            )}
          </form>
        </section>
      </section>
    </>
  );
};

export default PostJob;
