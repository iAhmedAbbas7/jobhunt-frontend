// <= IMPORTS =>
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircleMore } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { incrementUnread } from "@/redux/chatSlice";

const NotificationListener = () => {
  // SOCKET REF FOR SOCKET INITIATION
  const socketRef = useRef();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOCATION
  const location = useLocation();
  // GETTING CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // USE EFFECT TO LISTEN FOR NEW MESSAGE NOTIFICATIONS
  useEffect(() => {
    // SERVER URL
    const serverURL = "http://localhost:8000";
    // INITIATING SOCKET CONNECTION
    const s = io(serverURL, { withCredentials: true });
    // SETTING SOCKET
    socketRef.current = s;
    // LISTENING FOR NEW MESSAGE NOTIFICATIONS
    s.on("newMessageNotification", (msg) => {
      // IF THERE IS NO USER
      if (!user) return;
      // IF MESSAGE IS DELETED FOR EVERYONE
      if (msg.isDeletedForEveryone) return;
      // IS THE SENDER IS THE CURRENT USER
      if (msg.sender._id === user._id) return;
      // GETTING CURRENT LOCATION PATHNAME
      const viewingRoomID = location.pathname.split("/").pop();
      // IF THE OTHER USER IS IN THE CHAT THEN NO NOTIFICATIONS WILL BE PUSHED
      if (viewingRoomID === msg.room) return;
      // SETTING UNREAD MESSAGES COUNT FOR THE ROOM
      dispatch(incrementUnread(msg.room));
      // PUSHING THE NOTIFICATION
      toast(`New Message from ${msg.sender.fullName}`, {
        icon: <MessageCircleMore />,
        action: {
          label: "View",
          onClick: () => navigate(`/chat/room/${msg.room}`),
        },
      });
    });
    // CLEANUP FUNCTION
    return () => {
      s.disconnect();
    };
  }, [user, navigate, location.pathname, dispatch]);
};

export default NotificationListener;
