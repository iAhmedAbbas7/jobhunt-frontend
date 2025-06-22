// <= IMPORTS =>
import { useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import useChat from "@/hooks/useChat";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import PROFILE from "../assets/images/AVATAR.png";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  MessageCircleMoreIcon,
  MessageCirclePlusIcon,
  X,
} from "lucide-react";

const MyChats = () => {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // USING LOAD ROOM FUNCTION FROM USE CHAT HOOK
  const { loadRooms, loading } = useChat();
  // NAVIGATION
  const navigate = useNavigate();
  // LOADING ROOMS ON COMPONENT MOUNT
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);
  // GETTING CHAT DATA FROM THE CHAT SLICE
  const { rooms, unreadCounts, onlineUsers, lastSeen } = useSelector(
    (store) => store.chat
  );
  // IF LOADING
  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen w-screen">
          <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
        </div>
      </>
    );
  }
  // IF NO CHATS
  if (!loading && rooms.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col gap-[1rem] items-center justify-center h-[87vh]">
          <Button
            onClick={() => navigate("/chats/requests")}
            className="bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
          >
            <MessageCirclePlusIcon />
            Chat Requests
          </Button>
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Chats Yet
          </span>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {/* MY CHATS MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* MY CHATS CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & CHAT REQUESTS BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <h1 className="flex items-center gap-[0.5rem] font-[600] text-gray-500 text-[2rem]">
              <MessageCircleMoreIcon className="text-color-DB w-[3rem] h-[3rem]" />{" "}
              Chats
            </h1>
            <Button
              onClick={() => navigate("/chats/requests")}
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
            >
              <MessageCirclePlusIcon />
              Chat Requests
            </Button>
          </div>
          {/* CHATS */}
          <div className="w-full flex flex-col items-center justify-center gap-[1rem]">
            {rooms.map((room) => {
              // OTHER PARTICIPANT DETAILS
              const other = room.participants.find((u) => u._id !== user._id);
              // UNREAD MESSAGES COUNT FOR EACH ROOM
              const count = unreadCounts[room._id] || 0;
              // CHECKING IF THE OTHER PARTICIPANT IS ONLINE OR NOT
              const isOnline = onlineUsers.includes(other._id);
              // CHECKING THE LAST SEEN OF THE OTHER USER
              const lastSeenTime = lastSeen[other._id] || null;
              return (
                <Link
                  to={`/chat/room/${room._id}`}
                  className="flex items-center justify-between w-full py-2 px-4 border-2 border-gray-100 rounded-md"
                  key={room._id}
                >
                  <div className="flex items-center gap-[1rem]">
                    <Avatar className="w-[84px] h-[84px] rounded-full">
                      <AvatarImage
                        src={other?.profile?.profilePhoto || PROFILE}
                        title={other?.fullName}
                        className="w-[84px] h-[84px] rounded-full"
                      />
                    </Avatar>
                    <div>
                      <h1 className="text-color-DB font-[600] text-[1.2rem]">
                        {other.fullName}
                      </h1>
                      <h1 className="text-[1rem] text-gray-600">
                        {room.job.title}
                      </h1>
                      <h3
                        className={`text-sm ${
                          isOnline ? "text-green-400" : "text-red-400"
                        } font-bold`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </h3>
                      <h3 className="text-xs text-gray-500 italic font-[600]">
                        {!isOnline &&
                          lastSeenTime &&
                          `Last Seen — (${formatDistanceToNow(
                            new Date(lastSeenTime),
                            { addSuffix: true }
                          )})`}
                      </h3>
                    </div>
                  </div>
                  {count > 0 && (
                    <span
                      title={`Unread Messages ${count}`}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-color-DB text-center text-white font-[600]"
                    >
                      <span>{count}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </>
  );
};

export default MyChats;
