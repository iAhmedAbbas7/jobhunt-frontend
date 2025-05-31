// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import {
  CheckCircle2,
  Globe,
  Loader2,
  SendHorizontalIcon,
  User2,
} from "lucide-react";

const CompanyDescription = () => {
  // CURRENT USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // LOCATION
  const location = useLocation();
  // COMPANY STATE FROM LOCATION
  const { company } = location.state || {};
  // GETTING ALL JOBS FROM JOB SLICE
  const { allJobs } = useSelector((store) => store.job);
  // FILTERING JOBS FOR THE SELECTED COMPANY (ARRAY)
  const companyJobs = allJobs.filter((job) => job.company._id === company._id);
  // FILTERING JOBS FOR THE SELECTED COMPANY (LENGTH)
  const companyJobsLength = allJobs.filter(
    (job) => job.company._id === company._id
  ).length;
  // STATE MANAGEMENT
  const [subscribed, setSubscribed] = useState(false);
  // EFFECT TO CHECK IF THE USER IS SUBSCRIBED TO THE COMPANY OR NOT
  useEffect(() => {
    if (user && user.subscriptions) {
      setSubscribed(user.subscriptions.includes(company._id));
    }
  }, [user, company._id]);
  // HANDLE SUBSCRIBE HANDLER
  const handleSubscribe = async () => {
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${COMPANY_API_ENDPOINT}/subscribe/${company._id}`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SAVING UPDATED USER IN THE AUTH STATE
        dispatch(setUser(response.data.updatedUser));
        // UPDATING LOCAL SUBSCRIBE STATE
        setSubscribed(true);
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
  // HANDLE UNSUBSCRIBE HANDLER
  const handleUnsubscribe = async () => {
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.delete(
        `${COMPANY_API_ENDPOINT}/unsubscribe/${company._id}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SAVING UPDATED USER IN THE AUTH STATE
        dispatch(setUser(response.data.updatedUser));
        // UPDATING LOCAL SUBSCRIBE STATE
        setSubscribed(false);
      }
    } catch (error) {
      console.log(error.response.data.message);
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
      {/* COMPANY DETAIL MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* COMPANY DETAIL CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* JOB COUNTER & CREATED DATE */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm">
              <SendHorizontalIcon size={20} />
              <span>
                Created On:{" "}
                <span className="text-gray-500">
                  {company?.createdAt.split("T")[0]}
                </span>
              </span>
            </div>
            <Link
              to={`/companies/${company._id}/jobs`}
              state={{ companyJobs: companyJobs, company: company }}
              className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm hover:bg-gray-200"
            >
              <User2 size={20} />
              <span>
                Total Jobs:{" "}
                <span className="text-gray-500">{companyJobsLength}</span>
              </span>
            </Link>
          </div>
          {/* COMPANY INFORMATION */}
          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center gap-[2rem]">
              <Avatar className="w-[100px] h-[100px] rounded-none">
                <AvatarImage
                  src={company?.logo}
                  alt="Logo"
                  className="w-[100px] h-[100px]"
                />
              </Avatar>
              <div>
                <h1 className="font-[500] text-[2.5rem] text-gray-600">
                  {company?.name}
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                  {company?.location}
                </p>
              </div>
            </div>
            {user && (
              <div>
                {subscribed ? (
                  <Button
                    onClick={handleUnsubscribe}
                    className="bg-color-DB hover:bg-color-LB focus:outline-none outline-none border-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Unsubscribing
                      </>
                    ) : (
                      <>
                        <CheckCircle2 /> Unsubscribe
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    className="bg-color-DB hover:bg-color-LB focus:outline-none outline-none border-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Subscribing
                      </>
                    ) : (
                      <>
                        <CheckCircle2 /> Subscribe
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
          {/* COMPANY DESCRIPTION */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Description
            </h1>
            <p className="text-gray-500 font-medium text-[1rem]">
              {company?.description}
            </p>
          </div>
          {/* COMPANY WEBSITE */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Website</h1>
            <a
              className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-color-DB"
              target="_blank"
              href={company?.website}
            >
              <Globe /> {company?.website}
            </a>
          </div>
          {/* COMPANY SUBSCRIBERS */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Subscribers
            </h1>
            <span className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-color-DB">
              <User2 /> {company?.subscribers?.length || 0}
            </span>
          </div>
        </section>
      </section>
    </>
  );
};

export default CompanyDescription;
