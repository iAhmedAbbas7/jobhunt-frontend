// <= IMPORTS =>
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { NOTIFICATION_API_ENDPOINT } from "@/utils/constants";
import { Bell, BellDot, ListXIcon, Loader2, Trash2, X } from "lucide-react";
import {
  clearNotifications,
  markNotificationAsRead,
  setNotifications,
} from "@/redux/notificationSlice";

const NotificationPanel = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [loading, setLoading] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  // GETTING NOTIFICATIONS FROM REDUX SLICE
  const reduxNotifications = useSelector(
    (state) => state.notification.notifications
  );
  // FUNCTION TO FETCH NOTIFICATIONS ONLY WHEN THERE IS USER
  const fetchNotifications = useCallback(async () => {
    // RETURNING IF USER IS NOT AVAILABLE
    if (!user) {
      return;
    }
    // LOADING STATE
    setLoading(true);
    try {
      // MAKING REQUEST
      const response = await axios.get(
        `${NOTIFICATION_API_ENDPOINT}/getNotifications`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // FETCHED NOTIFICATIONS FROM API
        const fetchedNotifications = response.data.notifications;
        // SAVING NOTIFICATIONS IN THE REDUX SLICE
        dispatch(setNotifications(fetchedNotifications));
        // FILTERING UNREAD NOTIFICATIONS
        const unreadCount = fetchedNotifications.filter(
          (notif) => notif.isRead === false
        ).length;
        // SHOWING UNREAD NOTIFICATIONS COUNT ONLY ON BUBBLE
        if (!panelVisible) {
          setNewNotificationCount(unreadCount);
        }
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  }, [dispatch, panelVisible, user]);
  // FETCHING NOTIFICATIONS AFTER 60 SECONDS AUTOMATICALLY
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // SETTING INTERVAL
      const interval = setInterval(fetchNotifications, 60000);
      // CLEANUP
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);
  // CLEAR NOTIFICATIONS HANDLER
  const clearNotificationsHandler = async () => {
    try {
      // MAKING REQUEST
      const response = await axios.delete(
        `${NOTIFICATION_API_ENDPOINT}/clearNotifications`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // CLEARING NOTIFICATIONS FROM SLICE
        dispatch(clearNotifications());
      }
    } catch (error) {
      console.log(
        error.response?.data?.message || "Failed to CLear Notifications"
      );
    }
  };
  // NOTIFICATION CLICK HANDLER
  const handleNotificationClick = async (notification) => {
    // IF NOTIFICATION IS NOT ALREADY MARKED AS READ
    if (!notification.isRead) {
      try {
        // MAKING REQUEST
        const response = await axios.patch(
          `${NOTIFICATION_API_ENDPOINT}/markAsRead/${notification._id}`,
          {},
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // UPDATING THE NOTIFICATION READ STATUS IN REDUX SLICE
          dispatch(markNotificationAsRead(notification._id));
        }
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    }
    // NAVIGATING TO NOTIFICATION LINK
    setPanelVisible(false);
    navigate(notification.link);
  };
  // NOTIFICATION DELETE HANDLER
  const handleDeleteNotification = async (notifId) => {
    try {
      // MAKING REQUEST
      const response = await axios.delete(
        `${NOTIFICATION_API_ENDPOINT}/deleteNotification/${notifId}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        dispatch(
          setNotifications(reduxNotifications.filter((n) => n._id !== notifId))
        );
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };
  return (
    <div className="z-[999999] overflow-hidden">
      {/* NOTIFICATIONS BUTTON */}
      <button
        title={`Unread ${newNotificationCount}`}
        onClick={() => setPanelVisible((prev) => !prev)}
        className="hover:bg-color-LB text-white fixed bottom-4 right-4 bg-color-DB p-2 rounded-full border-none outline-none"
      >
        <Bell />
        {/* IF THERE ARE NEW NOTIFICATIONS AVAILABLE */}
        {newNotificationCount > 0 && (
          <div className="absolute bottom-8 right-0 bg-red-600 rounded-full w-6 h-6">
            {newNotificationCount}
          </div>
        )}
      </button>
      {/* NOTIFICATION PANEL */}
      {panelVisible && (
        <div className="fixed top-[5.5rem] bottom-[4rem] right-4 w-80 h-74[vh] rounded-lg p-2 bg-white shadow-xl flex flex-col gap-[1rem]">
          {/* HEADING SECTION */}
          <div className="flex items-center justify-between py-4 bg-gray-100 px-2 rounded-md text-gray-500">
            <h3 className="flex items-center gap-2">
              Notifications <BellDot className="w-4 h-4" />
            </h3>
            <button
              onClick={() => setPanelVisible(false)}
              title="Close"
              className="rounded-md bg-color-LB p-1 text-white border-none outline-none hover:bg-color-DB"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* NOTIFICATIONS SECTION */}
          <div className="overflow-y-auto py-[0.5rem]">
            {loading ? (
              <div className="w-full h-[60vh] px-2 flex items-center justify-center">
                <div>
                  <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                </div>
              </div>
            ) : reduxNotifications.length === 0 ? (
              <div className="text-white px-2 py-2 rounded-md flex items-center gap-[0.5rem] bg-color-LB">
                <ListXIcon /> No Notifications
              </div>
            ) : (
              <div className="flex flex-col gap-[0.5rem] overflow-y-auto">
                {reduxNotifications.map((notification) => (
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex flex-col gap-[0.5rem] px-2 py-2 ${
                      notification.isRead ? "bg-gray-50" : "bg-blue-50"
                    }  rounded-md cursor-pointer`}
                    key={notification._id}
                  >
                    <p className="text-gray-600">{notification.message}</p>
                    <div className="text-xs text-gray-400 flex items-center justify-between">
                      <p>
                        {new Date(notification.createdAt).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="outline-none border-none bg-gray-200 rounded-full hover:bg-gray-100 p-1 "
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* CLEAR NOTIFICATION BUTTON */}
          <div className=" w-full flex items-center justify-center px-2 py-2 absolute bottom-0 right-0">
            <div
              title="Clear"
              onClick={clearNotificationsHandler}
              className="rounded-full bg-gray-200 p-1 text-color-DB cursor-pointer hover:bg-gray-100"
            >
              <Trash2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
