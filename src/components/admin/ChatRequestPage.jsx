// <= IMPORTS =>
import { toast } from "sonner";
import { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useChatRequests from "@/hooks/useChatRequests";
import { Check, Loader2, MessageCircleMoreIcon, X } from "lucide-react";

const ChatRequestPage = () => {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // NAVIGATION
  const navigate = useNavigate();
  // USING USE CHAT REQUESTS HOOK
  const {
    loading,
    error,
    requests,
    sentRequests,
    fetchRequests,
    respondToChatRequest,
  } = useChatRequests();
  // LOADING PENDING REQUESTS ON COMPONENT MOUNT
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  // CHAT REQUEST RESPOND HANDLER
  const handleRespond = async (id, action) => {
    try {
      // GETTING ROOM FROM REQUEST
      const { room } = await respondToChatRequest({ id, action });
      // IF THE REQUEST IS ACCEPTED NAVIGATING TO THE CHAT ROOM
      if (action === "ACCEPTED" && room?._id) {
        navigate(`/chat/room/${room._id}`);
      }
    } catch {
      // TOASTING ERROR MESSAGE
      toast.error("Failed to Perform Action!");
      console.log(error);
    }
  };
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
  // IF NO REQUESTS FOR RECRUITER
  if (!loading && user?.role === "RECRUITER" && requests.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Chat Requests at this Time
          </span>
        </div>
      </>
    );
  }
  // IF NO REQUESTS FOR STUDENT
  if (!loading && user?.role === "STUDENT" && sentRequests.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Sent Chat Requests at this Time
          </span>
        </div>
      </>
    );
  }
  // IF ERROR
  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> Failed to Load Chat Requests
          </span>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {/* CHAT REQUESTS PAGE MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* CHAT REQUESTS PAGE CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-start">
            <h1 className="flex items-center gap-[0.5rem] font-[600] text-gray-500 text-[2rem]">
              {" "}
              <MessageCircleMoreIcon className="text-color-DB w-[3rem] h-[3rem]" />{" "}
              Chat Requests
            </h1>
          </div>
          {/* REQUESTS FOR RECRUITERS */}
          {user && user?.role === "RECRUITER" && (
            <div className="w-full flex flex-col items-center justify-center">
              {requests.map((req) => (
                <div
                  className="flex flex-col gap-[1rem] w-full p-4 border-2 border-gray-100 rounded-md"
                  key={req._id}
                >
                  {/* REQUEST TEXT */}
                  <div className="w-full text-gray-600 text-[1.2rem]">
                    <span className="font-[600] text-color-DB">
                      {req.from.fullName}
                    </span>{" "}
                    wants to Chat about{" "}
                    <span className="font-[600] text-color-DB">
                      {req.job.title}
                    </span>{" "}
                    Job that you Posted
                  </div>
                  {/* REQUEST ACTION BUTTONS */}
                  <div className="flex items-center justify-start gap-[1rem]">
                    <Button
                      onClick={() => handleRespond(req._id, "ACCEPTED")}
                      className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                    >
                      <Check />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRespond(req._id, "REJECTED")}
                      className="bg-color-MAIN hover:bg-color-LBR font-medium text-[1rem] focus:outline-none outline-none border-none"
                    >
                      <X />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* REQUESTS FOR STUDENTS */}
          {user && user?.role === "STUDENT" && (
            <div className="w-full flex flex-col items-center justify-center">
              {sentRequests.map((req) => (
                <div
                  className="flex flex-col gap-[1rem] w-full p-4 border-2 border-gray-100 rounded-md"
                  key={req._id}
                >
                  {/* REQUEST TEXT */}
                  <div className="w-full text-gray-600 text-[1.2rem]">
                    Your Chat Request to{" "}
                    <span className="font-[600] text-color-DB">
                      {req.to.fullName}
                    </span>{" "}
                    is in{" "}
                    <span className="font-[600] text-color-DB">
                      {req.status}
                    </span>{" "}
                    State at this Time{" "}
                    <span
                      onClick={() =>
                        navigate(`/jobs/description/${req.job._id}`)
                      }
                      className="font-[600] text-color-DB cursor-pointer"
                    >
                      ({req.job.title})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default ChatRequestPage;
