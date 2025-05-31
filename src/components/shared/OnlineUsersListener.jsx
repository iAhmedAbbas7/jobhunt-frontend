// <= IMPORTS =>
import { io } from "socket.io-client";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOnlineUser,
  removeOnlineUser,
  setOnlineUsers,
  setRoomLastSeen,
} from "@/redux/chatSlice";

const OnlineUsersListener = () => {
  // GETTING ALL ROOMS FROM CHAT SLICE
  const { rooms } = useSelector((store) => store.chat);
  // CONFIGURING THE PARTICIPANTS IN ALL ROOMS
  const participants = useMemo(() => {
    return new Set(rooms.flatMap((r) => r.participants.map((p) => p._id)));
  }, [rooms]);
  // DISPATCH
  const dispatch = useDispatch();
  // SOCKET REF
  const socketRef = useRef(null);
  // EFFECT TO GET ONLINE USERS
  useEffect(() => {
    // SERVER URL
    const serverURL = "http://localhost:8000";
    // INITIATING SOCKET CONNECTION
    const s = io(serverURL, { withCredentials: true });
    // SETTING SOCKET
    socketRef.current = s;
    // GETTING FULL LIST ON ONLINE USERS FROM SERVER
    s.on("initialOnlineUsers", (userIdArray) => {
      dispatch(setOnlineUsers(userIdArray));
    });
    // ADDING NEW ONLINE USER TO THE LIST
    s.on("userStatus", ({ userId, status }) => {
      if (status === "Online") dispatch(addOnlineUser(userId));
      else dispatch(removeOnlineUser(userId));
    });
    // CHECKING FOR USER'S LAST SEEN TIME
    s.on("userLastSeen", ({ userId, lastSeen }) => {
      if (participants.has(userId)) {
        dispatch(setRoomLastSeen({ [userId]: lastSeen }));
      }
    });
    // CLEANUP FUNCTION
    return () => {
      s.disconnect();
    };
  }, [dispatch, participants]);
  // RETURNING NULL
  return null;
};

export default OnlineUsersListener;
