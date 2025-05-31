// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { setLoading } from "@/redux/authSlice";
import { Avatar } from "@radix-ui/react-avatar";
import { setSingleJob } from "@/redux/jobSlice";
import useChatRequests from "@/hooks/useChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRightCircleIcon,
  Check,
  CheckCircleIcon,
  Loader2,
  MessageCircle,
  MessageSquare,
  SendHorizontalIcon,
  SendIcon,
  User2,
} from "lucide-react";
import {
  APPLICATION_API_ENDPOINT,
  CHAT_API_ENDPOINT,
  JOB_API_ENDPOINT,
} from "@/utils/constants";

const JobDescription = () => {
  // USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // NAVIGATION
  const navigate = useNavigate();
  // APPLY LOADING STATE
  const [applyLoading, setApplyLoading] = useState(false);
  // RETRIEVING JOB ID FROM URL PARAMS
  const params = useParams();
  const jobId = params.id;
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING SINGLE JOB FROM JOB SLICE
  const { singleJob } = useSelector((store) => store.job);
  // GETTING CHATS FROM CHAT SLICE
  const { rooms } = useSelector((store) => store.chat);
  // USING USE CHAT REQUEST HOOK
  const {
    sentRequests,
    acceptedRequests,
    sendMessageRequest,
    loading: reqLoading,
  } = useChatRequests();
  // JOB APPLY TRACKER
  const hasInitiallyApplied = singleJob?.applications?.some(
    (application) => application.applicant === user?._id || false
  );
  // JOB APPLY STATE MANAGEMENT
  const [hasApplied, setHasApplied] = useState(hasInitiallyApplied);
  // CHECKING IF THE CHAT HAS BEEN REQUESTED
  const hasRequestedChat = sentRequests.some(
    (r) => r.job._id.toString() === jobId
  );
  // CHAT REQUESTED STATE MANAGEMENT
  const [requestedChat, setRequestedChat] = useState(hasRequestedChat);
  // CHECKING IF THE CHAT REQUEST HAS BEEN ACCEPTED
  const hasAcceptedChat = acceptedRequests.some(
    (r) => r.job._id.toString() === jobId
  );
  // CHECKING IF THE CHAT HAS ALREADY INITIATED BY THE RECRUITER
  const hasChatAlready = rooms.some((r) => r.job._id.toString() === jobId);
  // OPEN CHAT HANDLER
  const handleChat = async () => {
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${CHAT_API_ENDPOINT}/room`,
        { jobId, otherUserId: singleJob.createdBy },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // NAVIGATING TO THE CHAT
        navigate(`/chat/room/${response.data.room._id}`);
      }
    } catch (error) {
      console.log("Unable to Open Chat!", error);
      // TOASTING ERROR MESSAGE
      toast.error("Unable to Open Chat!");
    }
  };
  // CHAT REQUEST HANDLER
  const handleChatRequest = async () => {
    // IF JOB OWNER'S ID IS MISSING
    if (!singleJob?.createdBy) return;
    try {
      await sendMessageRequest({
        to: singleJob.createdBy,
        job: jobId,
      });
      // TOASTING SUCCESS MESSAGE
      toast.success("Chat Request Sent Successfully!");
      // SETTING CHAT REQUEST LOCAL STATE
      setRequestedChat(true);
    } catch (err) {
      // TOASTING ERROR MESSAGE
      toast.error(err.response.data.message || "Failed to Send Chat Request!");
    }
  };
  // JOB APPLY HANDLER
  const applyJobHandler = async () => {
    try {
      // LOADING STATE
      setApplyLoading(true);
      // MAKING REQUEST
      const response = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // UPDATING APPLY STATUS
        setHasApplied(true);
        // UPDATING SINGLE JOB
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        // SAVING UPDATED JOB IN THE JOB SLICE
        dispatch(setSingleJob(updatedSingleJob));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    } finally {
      // LOADING STATE
      setApplyLoading(false);
    }
  };
  // UI UPDATE MANAGEMENT
  useEffect(() => {
    // RESETTING JOB DETAILS
    dispatch(setSingleJob(null));
    setHasApplied(false);
    dispatch(setLoading(true));

    // FETCHING SINGLE JOB FROM THE API
    const fetchSingleJob = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SAVING SINGLE JOB IN THE JOB SLICE
          dispatch(setSingleJob(response.data.job));
          // CHECKING JOB APPLIED STATUS FOR THE USER
          setHasApplied(
            response.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        // LOADING STATE
        dispatch(setLoading(false));
      }
    };
    fetchSingleJob();
  }, [dispatch, jobId, user?._id]);
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
      {/* JOB DESCRIPTION MAIN WRAPPER */}
      <section className="w-full sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* JOB DESCRIPTION CONTENT WRAPPER */}
        <section className="flex items-start justify-center flex-col flex-wrap gap-[1rem] tracking-[0.5px] border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem]">
          {/* APPLICANTS COUNTER & POSTED DATE */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm">
              <SendHorizontalIcon size={20} />
              <span>
                Posted On:{" "}
                <span className="text-gray-500">
                  {singleJob?.createdAt.split("T")[0]}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm">
              <User2 size={20} />
              <span>
                Total Applicants:{" "}
                <span className="text-gray-500">
                  {singleJob?.applications?.length}
                </span>
              </span>
            </div>
          </div>
          {/* CHAT REQUEST, CHAT, HIRE STATUS & APPLY BUTTON */}
          <div className="w-full flex items-center justify-end gap-[1rem]">
            {hasApplied &&
              !requestedChat &&
              !hasAcceptedChat &&
              !hasChatAlready && (
                <div>
                  {reqLoading ? (
                    <Button
                      disabled={reqLoading || requestedChat}
                      className="bg-color-DB hover:bg-color-LB outline-none border-none focus:outline-none"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Chat Request
                    </Button>
                  ) : (
                    <Button
                      onClick={handleChatRequest}
                      className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none ${
                        requestedChat ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      disabled={reqLoading || requestedChat}
                    >
                      {requestedChat ? <CheckCircleIcon /> : <MessageSquare />}
                      {requestedChat
                        ? "Chat Request Sent"
                        : "Chat With Recruiter"}
                    </Button>
                  )}
                </div>
              )}
            {hasApplied &&
              requestedChat &&
              !hasAcceptedChat &&
              !hasChatAlready && (
                <div>
                  {reqLoading ? (
                    <Button
                      disabled={reqLoading || requestedChat}
                      className="bg-color-DB hover:bg-color-LB outline-none border-none focus:outline-none"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Chat Request
                    </Button>
                  ) : (
                    <Button
                      onClick={handleChatRequest}
                      className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none ${
                        requestedChat ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      disabled={reqLoading || requestedChat}
                    >
                      {requestedChat ? <CheckCircleIcon /> : <MessageSquare />}
                      {requestedChat
                        ? "Chat Request Sent"
                        : "Chat With Recruiter"}
                    </Button>
                  )}
                </div>
              )}
            {(hasAcceptedChat || hasChatAlready) && (
              <Button
                onClick={handleChat}
                className="bg-color-DB hover:bg-color-LB focus:outline-none outline-none border-none"
              >
                <MessageCircle />
                Open Chat
              </Button>
            )}
            {singleJob?.hired === true ? (
              <Button
                disabled={singleJob?.hired}
                className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Check /> Hired
              </Button>
            ) : (
              <div>
                {applyLoading ? (
                  <Button className="bg-color-DB hover:bg-color-LB focus:outline-none outline-none border-none">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Applying Job
                  </Button>
                ) : (
                  <Button
                    onClick={hasApplied ? null : applyJobHandler}
                    className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none ${
                      hasApplied ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={hasApplied}
                  >
                    {hasApplied ? <CheckCircleIcon /> : <SendIcon />}
                    {hasApplied ? "Job Applied" : "Apply Now"}
                  </Button>
                )}
              </div>
            )}
          </div>
          {/* COMPANY INFORMATION */}
          <div className="w-full flex items-center gap-[2rem]">
            <Link
              to={`/companies/description/${singleJob?.company?._id}`}
              state={{ company: singleJob?.company }}
            >
              <Avatar className="w-[100px] h-[100px] rounded-none">
                <AvatarImage
                  src={singleJob?.company?.logo}
                  alt="Logo"
                  className="w-[100px] h-[100px]"
                />
              </Avatar>
            </Link>
            <div>
              <h1 className="font-[500] text-[2.5rem] text-gray-600">
                {singleJob?.company?.name}
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                {singleJob?.location}
              </p>
            </div>
          </div>
          {/* JOB TITLE */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Title</h1>
            <h4 className="text-gray-500 font-medium text-[1.5rem]">
              {singleJob?.title}
            </h4>
          </div>
          {/* JOB DESCRIPTION */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Description
            </h1>
            <p className="text-gray-500 font-medium text-[1rem]">
              {singleJob?.description}
            </p>
          </div>
          {/* JOB DETAILS */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Details</h1>
            <div className="flex flex-wrap gap-[1rem]">
              <div className="px-[1rem] py-[0.5rem] bg-color-LB text-white rounded-full">
                {singleJob?.position} Positions
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-DB text-white rounded-full">
                {singleJob?.jobType}
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-MAIN text-white rounded-full">
                {singleJob?.salary} LPA
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-MAIN text-white rounded-full">
                {singleJob?.experienceLevel} + Years Experience
              </div>
            </div>
          </div>
          {/* JOB REQUIREMENTS */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Requirements
            </h1>
            <div className="text-gray-500 font-medium">
              <div className="flex flex-col items-start justify-center gap-[1rem]">
                {singleJob?.requirements.map((item, index) => (
                  <span
                    className="flex items-center gap-[0.5rem] text-[1.35rem]"
                    key={index}
                  >
                    <ArrowRightCircleIcon size={25} className="text-color-DB" />{" "}
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default JobDescription;
