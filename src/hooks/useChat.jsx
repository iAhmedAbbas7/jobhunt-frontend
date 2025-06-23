// <= IMPORTS =>
import axios from "axios";
import { useCallback, useState } from "react";
import { CHAT_API_ENDPOINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setRoomLastSeen, setRooms, setUnreadCounts } from "@/redux/chatSlice";

const useChat = () => {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // CURRENT USER CREDENTIALS
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  // LOADING ROOMS
  const loadRooms = useCallback(async () => {
    // IF NOT USER
    if (!user) return;
    // LOADING STATE
    setLoading(true);
    // MAKING REQUEST
    try {
      const [roomsResponse, countResponse] = await Promise.all([
        axios.get(`${CHAT_API_ENDPOINT}/rooms`, {
          withCredentials: true,
        }),
        axios.get(`${CHAT_API_ENDPOINT}/rooms/unreadCounts`, {
          withCredentials: true,
        }),
      ]);
      // SETTING ROOMS ON ROOMS RESPONSE SUCCESS & FETCHING EACH ROOM'S LAST SEEN
      if (roomsResponse.data.success) {
        dispatch(setRooms(roomsResponse.data.rooms));
        for (const room of roomsResponse.data.rooms) {
          axios
            .get(`${CHAT_API_ENDPOINT}/rooms/${room._id}/lastSeen`, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.success) {
                // SETTING THE ROOMS LAST SEEN
                dispatch(setRoomLastSeen(response.data.lastSeen));
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
      // SETTING UNREAD COUNTS ON COUNT RESPONSE SUCCESS
      if (countResponse.data.success)
        dispatch(setUnreadCounts(countResponse.data.counts));
    } catch (error) {
      console.log(error);
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  }, [dispatch, user]);

  return { loading, loadRooms };
};

export default useChat;
