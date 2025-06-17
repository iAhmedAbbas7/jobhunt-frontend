// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import { io } from "socket.io-client";
import Picker from "emoji-picker-react";
import PDF from "../assets/images/PDF.png";
import { setLoading } from "@/redux/authSlice";
import { formatDistanceToNow } from "date-fns";
import { resetUnread } from "@/redux/chatSlice";
import TypingBubble from "./shared/TypingBubble";
import PROFILE from "../assets/images/AVATAR.png";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import PresenceBubble from "./shared/PresenceBubble";
import { PopoverClose } from "@radix-ui/react-popover";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CHAT_API_ENDPOINT, SCHEDULE_API_ENDPOINT } from "@/utils/constants";
import {
  ArrowDown,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ArrowUpToLineIcon,
  Briefcase,
  Calendar,
  CalendarDaysIcon,
  CalendarSearchIcon,
  Clock,
  Edit,
  FileText,
  Globe,
  Image,
  InfoIcon,
  Loader2,
  LucideChartBarIncreasing,
  LucideClock,
  LucideMessageSquareReply,
  MessageCircleMoreIcon,
  MessageSquareMoreIcon,
  MoreHorizontal,
  MoreVertical,
  PaperclipIcon,
  PlusCircle,
  Reply,
  Save,
  Search,
  SendHorizonalIcon,
  Star,
  Sticker,
  Text,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import {
  deleteFromQueue,
  dequeueAll,
  enqueue,
  updateInQueue,
} from "@/utils/offlineQueue";

const ChatRoomPage = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING ROOM ID FROM USE PARAMS
  const { id: roomId } = useParams();
  // GETTING CURRENT USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // GETTING CHAT DATA FROM THE CHAT SLICE
  const { onlineUsers, lastSeen } = useSelector((store) => store.chat);
  // LOCAL DATE & TIME CONVERTER FUNCTION
  const toLocalDateTimeString = (utcDateOrISO) => {
    // GETTING DATE
    const date = new Date(utcDateOrISO);
    // CALCULATING TIMEZONE OFFSET
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    // CONVERTING TO LOCAL DATE AND TIME
    const localDate = new Date(date.getTime() - timeZoneOffset);
    // RETURNING LOCAL DATE AND TIME
    return localDate.toISOString().slice(0, 16);
  };
  // STATE MANAGEMENT
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [room, setRoom] = useState(null);
  const [file, setFile] = useState(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingID, setEditingID] = useState(null);
  const [reactingTo, setReactingTo] = useState(null);
  const [stickyDate, setStickyDate] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [otherInRoom, setOtherInRoom] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [scheduledList, setScheduledList] = useState([]);
  const [scheduledText, setScheduledText] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [scrollDown, setShowScrollDown] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [emojiPicker, setShowEmojiPicker] = useState(false);
  const [popoverAction, setPopoverAction] = useState("FIRST");
  const [showJumpToDate, setShowJumpToDate] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showDateSearch, setShowDateSearch] = useState(false);
  const [showMediaAndDocs, setShowMediaAndDocs] = useState(false);
  const [mediaAndDocsTab, setMediaAndDocsTab] = useState("MEDIA");
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  // FILTERED MESSAGES FOR TEXT SEARCH TERM
  const filtered = searchTerm
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  // FILTERED MESSAGES FOR DATE SEARCH
  const dateMatches = messages.filter((m) => {
    const msgDate = new Date(m.createdAt).toISOString().slice(0, 10);
    return msgDate === searchDate;
  });
  // JUMP TO DATES HANDLING
  const uniqueDates = [];
  messages.forEach((m) => {
    const key = new Date(m.createdAt).toISOString().slice(0, 10);
    if (!uniqueDates.includes(key)) uniqueDates.push(key);
  });
  // COUNTING MESSAGES FOR EACH UNIQUE DATE
  const dateCounts = messages.reduce((map, m) => {
    const key = new Date(m.createdAt).toISOString().slice(0, 10);
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
  // FILTERING LINK MESSAGES
  const linkMessages = messages.filter(
    (m) => m.preview && m.preview.url !== ""
  );
  // FILTERING MEDIA MESSAGES
  const mediaMessages = messages.filter((m) =>
    (m.attachments ?? []).some((a) => a.contentType.startsWith("image/"))
  );
  // DOCUMENT MESSAGES
  const documentMessages = messages.filter((m) =>
    (m.attachments ?? []).some((a) => !a.contentType.startsWith("image/"))
  );
  // STARRED MESSAGES
  const starredMessages = messages.filter((m) =>
    m.starredBy?.includes(user._id)
  );
  // STOP TYPING TIMEOUT
  let stopTypingTimeout = useRef(null);
  // SOCKET REF
  const socketRef = useRef();
  // CHAT REF
  const endRef = useRef();
  // REACTION PICKER REF
  const pickerRef = useRef(null);
  // MESSAGES REF
  const messagesRef = useRef({});
  // MESSAGES CONTAINER REF
  const messagesContainerRef = useRef(null);
  // DATE DIVIDERS REF
  const dateDividerRefs = useRef({});
  // FILE INPUT REF
  const fileInputRef = useRef();
  // PREVIOUS MESSAGES COUNT
  const previousMessagesCount = useRef(messages.length);
  // DETECTING WHEN THE BROWSER IS ONLINE OR OFFLINE
  useEffect(() => {
    // FOR BROWSER ONLINE
    const onOnline = () => setIsBrowserOnline(true);
    // FOR BROWSER OFFLINE
    const onOffline = () => setIsBrowserOnline(false);
    // ONLINE EVENT LISTENER
    window.addEventListener("online", onOnline);
    // OFFLINE EVENT LISTENER
    window.addEventListener("offline", onOffline);
    // CLEANUP FUNCTION
    return () => {
      // REMOVING EVENT LISTENERS
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  // FLUSHING PENDING MESSAGES ON BROWSER ONLINE
  useEffect(() => {
    // IF BROWSER IS NOT ONLINE
    if (!isBrowserOnline) return;
    // IF BROWSER HAS BECOME ONLINE DEQUEUING ALL PENDING MESSAGES
    dequeueAll().then((pending) => {
      pending.forEach((payload) => actuallySend(payload));
      // CLEARING PENDING MESSAGES FROM THE UI
      setMessages((prev) => prev.filter((m) => !m.pending));
    });
  }, [isBrowserOnline]);
  // LOADING ROOM INFO (PARTICIPANTS & JOB)
  useEffect(() => {
    if (!roomId) return;
    // LOADING STATE
    dispatch(setLoading(true));
    axios
      .get(`${CHAT_API_ENDPOINT}/rooms`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          const found = res.data.rooms.find((r) => r._id === roomId);
          // SETTING THE ROOM
          setRoom(found || null);
        }
      })
      .finally(() => dispatch(setLoading(false)));
  }, [roomId, dispatch]);
  // LOADING MESSAGES FOR THAT ROOM
  useEffect(() => {
    if (!roomId) return;
    axios
      .get(`${CHAT_API_ENDPOINT}/room/${roomId}/messages`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages.reverse());
          dispatch(resetUnread(roomId));
        }
      });
  }, [roomId, dispatch]);
  // EFFECT TO GET THE STICKY DATE FOR MESSAGES LIST
  useEffect(() => {
    // MESSAGES CONTAINER REF
    const container = messagesContainerRef.current;
    // IF NO CONTAINER REF
    if (!container) return;
    // CALLING STICKY DATE FUNCTION
    stickyDateOnScroll();
    // ADDING EVENT LISTENER
    container.addEventListener("scroll", stickyDateOnScroll, { passive: true });
    // CLEANUP FUNCTION
    return () => {
      // REMOVING THE EVENT LISTENER ON COMPONENT UNMOUNT
      container.removeEventListener("scroll", stickyDateOnScroll);
    };
    // RE-RUN WHEN MESSAGES CHANGES
  }, [messages]);
  // INITIATING SOCKET CONNECTION ONLY AFTER GETTING ROOM ID
  useEffect(() => {
    if (!roomId) return;
    // SERVER URL
    const serverURL = "http://localhost:8000";
    // INITIATING SOCKET
    const s = io(serverURL, { withCredentials: true });
    // SETTING SOCKET
    socketRef.current = s;
    // EMITTING JOIN ROOM EVENT
    s.emit("joinChatRoom", roomId);
    // EMITTING MARKING ROOM READ EVENT
    s.emit("markRoomRead", { roomId, userId: user._id });
    // CLEARING UNREAD COUNT ON JOINING ROOM
    dispatch(resetUnread(roomId));
    // ON SOCKET CONNECTION CLEARING QUEUED MESSAGES
    s.on("connection", async () => {
      // GETTING PENDING MESSAGES
      const pending = await dequeueAll();
      // SENDING EACH MESSAGE
      pending.forEach((payload) => actuallySend(payload));
      // CLEARING PENDING MESSAGES FROM THE UI
      setMessages((prev) => prev.filter((m) => !m.pending));
    });
    // LISTENING FOR OTHER USER JOINING ROOM EVENT
    s.on("userInRoom", ({ userId, inRoom }) => {
      if (userId !== user._id) {
        setOtherInRoom(inRoom);
      }
    });
    // LISTENING FOR NEW MESSAGE EVENT
    s.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    // LISTENING FOR ROOM MESSAGES READ EVENT
    s.on("roomMessagesRead", ({ roomId: r, userId: reader }) => {
      if (r !== roomId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.readBy?.includes(reader)
            ? m
            : { ...m, readBy: [...m.readBy, reader] }
        )
      );
    });
    // LISTENING FOR MESSAGE DELETED EVENT
    s.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });
    // LISTENING FOR EDITED MESSAGE EVENT
    s.on("messageEdited", (editedMessage) => {
      console.log("Edited Message", editedMessage);
      setMessages((prev) =>
        prev.map((m) => (m._id === editedMessage._id ? editedMessage : m))
      );
    });
    // LISTENING FOR MESSAGE REACTION EVENT
    s.on("messageReacted", (updated) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    });
    // LISTENING FOR STARRED MESSAGE EVENT
    s.on("starredMessage", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    });
    // LISTENING FOR TYPING EVENT
    s.on("typing", ({ userId }) => {
      if (userId !== user._id) setOtherTyping(true);
    });
    // LISTENING FOR STOP TYPING EVENT
    s.on("stopTyping", ({ userId }) => {
      if (userId !== user._id) setOtherTyping(false);
    });
    return () => {
      s.disconnect();
      clearTimeout(stopTypingTimeout.current);
    };
  }, [roomId, user._id, navigate, dispatch]);
  // AUTO SCROLL
  useEffect(() => {
    // ONLY SCROLLING WHEN THERE IS A NEW MESSAGE IN THE LIST
    if (messages.length > previousMessagesCount.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // UPDATING THE COUNT FOR NEXT RENDER
    previousMessagesCount.current = messages.length;
  }, [messages]);
  // REACTION PICKER CLICK OUTSIDE HANDLER EFFECT
  useEffect(() => {
    if (!reactingTo) return;
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setReactingTo(null);
      }
    };
    // ADDING THE EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP FUNCTION
    return () => {
      // REMOVING THE EVENT LISTENER
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reactingTo]);
  // FETCHING THE SCHEDULED MESSAGES WHENEVER THE MEDAL OPENS
  useEffect(() => {
    if (!showSchedule) return;
    axios
      .get(`${SCHEDULE_API_ENDPOINT}/${roomId}`, { withCredentials: true })
      .then(
        (response) =>
          response.data.success && setScheduledList(response.data.scheduled)
      );
  }, [showSchedule, roomId, messages]);
  // SCROLL TO BOTTOM BUTTON EFFECT
  useEffect(() => {
    // CONTAINER
    const container = messagesContainerRef.current;
    // IF NOT CONTAINER
    if (!container) return;
    // ON SCROLL FUNCTION
    const onScroll = () => {
      // CONTAINER ATTRIBUTES
      const { scrollTop, scrollHeight, clientHeight } = container;
      // SHOWING SCROLL BOTTOM WHEN WE HAVE SCROLLED 100PX FROM THE BOTTOM
      setShowScrollDown(scrollTop + clientHeight < scrollHeight - 100);
    };
    // ADDING EVENT LISTENER
    container.addEventListener("scroll", onScroll, { passive: true });
    // INITIAL CHECK
    onScroll();
    // CLEANUP FUNCTION
    return () => {
      // REMOVING EVENT LISTENER ON COMPONENT UNMOUNT
      container.removeEventListener("scroll", onScroll);
    };
  }, [messages]);
  // CREATE SCHEDULED MESSAGE
  const createScheduledMessage = async () => {
    // LOADING STATE
    setLocalLoading(true);
    try {
      const response = await axios.post(
        `${SCHEDULE_API_ENDPOINT}/${roomId}`,
        { text: scheduledText.trim(), sendAt: scheduledDate },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // UPDATING THE SCHEDULED MESSAGES LIST
        setScheduledList((list) => [...list, response.data.scheduledMessage]);
        // SETTING SCHEDULED TEXT TO EMPTY STRING
        setScheduledText("");
        // SETTING SCHEDULED DATE TO EMPTY
        setScheduledDate("");
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(
        error.response.data.message || "Error Creating Scheduled Message!"
      );
    } finally {
      // LOADING STATE
      setLocalLoading(false);
    }
  };
  // CANCEL SCHEDULED MESSAGE
  const cancelScheduledMessage = async (id) => {
    try {
      const response = await axios.delete(`${SCHEDULE_API_ENDPOINT}/${id}`, {
        withCredentials: true,
      });
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // UPDATING SCHEDULED MESSAGES LIST
        setScheduledList((list) => list.filter((s) => s._id !== id));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(
        error.response.data.message || "Error Cancelling Scheduled Message!"
      );
    }
  };
  // UPDATE SCHEDULED MESSAGE
  const updateScheduledMessage = async (id, newText, newDate) => {
    try {
      const response = await axios.patch(
        `${SCHEDULE_API_ENDPOINT}/${id}`,
        { text: newText, sendAt: newDate },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // UPDATING SCHEDULED MESSAGES LIST
        setScheduledList((list) =>
          list.map((s) => (s._id === id ? response.data.scheduled : s))
        );
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(
        error.response.data.message || "Error Updating Scheduled Message!"
      );
    }
  };
  // SCHEDULED MESSAGE EDIT STARTER FUNCTION
  const startScheduledEdit = (m) => {
    // SETTING THE EDITING ID TO THE MESSAGE TO BE EDITED
    setEditingID(m._id);
    // SETTING TEXT TO BE EDITED
    setEditingText(m.text);
    // SETTING DATE TO BE EDITED
    setEditingDate(toLocalDateTimeString(m.sendAt));
  };
  // UPDATE SCHEDULED MESSAGE SAVE HANDLER
  const handleScheduledSave = async () => {
    // USING UPDATE SCHEDULED MESSAGE HANDLER
    await updateScheduledMessage(
      editingID,
      editingText,
      new Date(editingDate).toISOString()
    );
    // CLEARING THE EDITING ID
    setEditingID(null);
  };
  // STICKY DATE HELPER FUNCTION
  const stickyDateOnScroll = () => {
    // MESSAGES CONTAINER
    const container = messagesContainerRef.current;
    // IF NO REF FOR THE CONTAINER
    if (!container) return;
    // GETTING THE CONTAINER SCROLL TOP HEIGHT
    const scrollTop = container.scrollTop;
    // CALCULATING THE MESSAGES CONTAINER BOTTOM
    const bottom = scrollTop + container.clientHeight;
    // GETTING ALL ELEMENTS OF THE CONTAINER
    const elements = Object.values(messagesRef.current);
    // FINDING THE IN VIEW ELEMENTS
    const inView = elements.filter((el) => el?.offsetTop <= bottom);
    // IF MORE IN VIEW ELEMENTS PRESENT
    if (inView.length) {
      // FINDING THE LAST VISIBLE ELEMENT FROM THE IN VIEW ELEMENTS
      const lastVisible = inView.reduce((prev, curr) =>
        curr.offsetTop > prev.offsetTop ? curr : prev
      );
      // GETTING THE DATE ATTRIBUTE FOR LAST VISIBLE ELEMENT
      const iso = lastVisible.getAttribute("data-date");
      // CREATING THE DATE FROM DATE ATTRIBUTE
      const date = new Date(iso);
      // SETTING TODAY MARKER
      const today = new Date().toISOString().slice(0, 10);
      // CREATING LABEL
      const label =
        iso === today
          ? "Today"
          : date.toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
      // SETTING STICKY DATE
      setStickyDate(label);
    }
  };
  // SCROLL TO MESSAGE HELPER
  const scrollToMessage = (id) => {
    // TARGET ELEMENT TO SCROLL TO
    const el = messagesRef.current[id];
    // IF NO TARGET ELEMENT
    if (!el) return;
    // SCROLLING TO ELEMENT
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // HIGHLIGHTING THE MESSAGE
    el.style.transition = "background-color 0.5s ease";
    el.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    setTimeout(() => {
      el.style.backgroundColor = "";
    }, 3000);
  };
  // SCROLL TO TOP OF THE CHAT HELPER
  const goToFirstMessage = () => {
    // IF NO CONTAINER REF
    if (!messagesContainerRef.current) return;
    // SCROLLING TO TOP
    messagesContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // INPUT CHANGE HANDLER
  const handleInputChange = (e) => {
    // SETTING DRAFT
    setDraft(e.target.value);
    // EMITTING TYPING EVENT
    socketRef.current?.emit("typing", { roomId, userId: user._id });
    // CLEARING ANY PENDING STOP TYPING
    clearTimeout(stopTypingTimeout.current);
    // SETTING TIME FOR STOP TYPING EVENT AFTER ONE SECOND OF INACTIVITY
    stopTypingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { roomId, userId: user._id });
    }, 1000);
  };
  // HANDLE FILE CHANGE
  const handleFileChange = (e) => {
    // FILE
    const file = e.target.files[0];
    // SETTING FILE IN STATE
    setFile(file);
    // SETTING FILE PREVIEW BASED ON THE FILE
    if (!file) {
      setFilePreview(null);
    } else if (file.type.startsWith("image/")) {
      setFilePreview({
        type: "image",
        url: URL.createObjectURL(file),
      });
    } else {
      setFilePreview({
        type: "file",
        name: file.name,
        mime: file.type,
      });
    }
    // RESETTING FILE INPUT REF
    fileInputRef.current.value = "";
  };
  // SEND MESSAGE
  const send = async () => {
    if (!draft.trim() && !file) return;
    // CREATING TEMPORARY ID
    const tempId = `temp-${Date.now()}`;
    // CREATING MESSAGE PAYLOAD OBJECT
    const payload = {
      _id: tempId,
      roomId,
      senderId: user._id,
      text: draft.trim(),
      parent: replyTo?._id || null,
      file,
    };
    // IF NOT ONLINE THEN ADDING TO THE QUEUE OTHERWISE SENDING DIRECTLY
    if (!isBrowserOnline) {
      // OPTIMISTICALLY UPDATING UI
      setMessages((prev) => [
        ...prev,
        {
          _id: tempId,
          text: payload.text,
          sender: user,
          createdAt: new Date().toISOString(),
          pending: !isBrowserOnline,
        },
      ]);
      await enqueue(payload);
    } else {
      await actuallySend(payload);
    }
    // RESETTING STATES
    setDraft("");
    setReplyTo(null);
    setFile(null);
    setFilePreview(null);
    // WHEN BROWSER COMES ONLINE FLUSHING PENDING MESSAGES
  };
  // ACTUALLY SEND MESSAGE HANDLER
  const actuallySend = async ({ roomId, senderId, text, parent, file }) => {
    // IF FILE IS BEING ATTACHED
    if (file) {
      // CREATING FOR DATA INSTANCE
      const formData = new FormData();
      // APPENDING DATA TO FORM DATA OBJECT
      formData.append("text", text);
      if (parent) formData.append("parent", parent);
      formData.append("file", file);
      // SENDING MESSAGE WITH FORM DATA
      try {
        await axios.post(
          `${CHAT_API_ENDPOINT}/room/${roomId}/message`,
          formData,
          { withCredentials: true }
        );
      } catch (error) {
        console.error(error.response.data.message);
        // TOASTING ERROR MESSAGE
        toast.error(error.response.data.message || "Error Sending Message!");
      }
    } else {
      socketRef.current?.emit("sendChatMessage", {
        roomId,
        senderId,
        text,
        parent: parent || null,
      });
      setDraft("");
      setReplyTo(null);
    }
  };
  // CLEAR CHAT HANDLER
  const clearChat = async () => {
    try {
      const response = await axios.delete(
        `${CHAT_API_ENDPOINT}/room/${roomId}/clearChat`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // CLEARING MESSAGES
        setMessages([]);
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    }
  };
  // DELETE FOR ME HANDLER
  const deleteForMe = async (messageId) => {
    try {
      const response = await axios.delete(
        `${CHAT_API_ENDPOINT}/message/${messageId}/deleteForMe`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // UPDATING MESSAGES
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    }
  };
  // DELETE FOR EVERYONE HANDLER
  const deleteForEveryone = async (messageId) => {
    try {
      const response = await axios.delete(
        `${CHAT_API_ENDPOINT}/room/${roomId}/message/${messageId}/deleteForEveryOne`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    }
  };
  // EDIT MESSAGE HANDLER
  const handleEdit = async (m) => {
    const { value: newText } = await Swal.fire({
      title: "Edit Message",
      input: "textarea",
      inputValue: m.text,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Save",
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      allowOutsideClick: false,
      customClass: {
        container: "my-swal-container",
      },
      preConfirm: (value) => {
        if (!value.trim()) {
          Swal.showValidationMessage("Message Cannot be Empty!");
          return value;
        }
      },
    });
    // IF NEW TEXT IS NOT VALID
    if (newText === undefined) return;
    // IF NEW TEXT IS VALID
    if (newText !== undefined) {
      try {
        const response = await axios.patch(
          `${CHAT_API_ENDPOINT}/message/${m._id}/edit`,
          { text: newText },
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // OPTIMISTICALLY UPDATING THE MESSAGES LIST
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === m._id ? { ...msg, text: newText, edited: true } : msg
            )
          );
          // TOASTING SUCCESS MESSAGE
          toast.success(response.data.message);
        }
      } catch (error) {
        console.log("Error Editing Message!", error);
        // TOASTING ERROR MESSAGE
        toast.error(error.response.data.message);
      }
    }
  };
  // DELETE PENDING MESSAGE HANDLER
  const deletePending = async (tempId) => {
    // REMOVING THE MESSAGE FROM UI IMMEDIATELY
    setMessages((prev) => prev.filter((m) => m._id !== tempId));
    // REMOVING IT FROM QUEUE LIST
    await deleteFromQueue(tempId);
    // TOASTING SUCCESS MESSAGE
    toast.success("Draft Deleted!");
  };
  // EDIT PENDING MESSAGE HANDLER
  const editPending = async (m) => {
    const { value: newText } = await Swal.fire({
      title: "Edit Draft",
      input: "textarea",
      inputValue: m.text,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Save",
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      allowOutsideClick: false,
      customClass: {
        container: "my-swal-container",
      },
      preConfirm: (value) => {
        if (!value.trim()) {
          Swal.showValidationMessage("Message Cannot be Empty!");
          return value;
        }
      },
    });
    // IF NEW TEXT IS NOT VALID
    if (newText === undefined) return;
    // UPDATING MESSAGES IN THE UI
    setMessages((prev) =>
      prev.map((msg) => (msg._id === m._id ? { ...msg, text: newText } : msg))
    );
    // UPDATING IN THE QUEUE LIST
    await updateInQueue(m._id, { text: newText });
    // TOASTING SUCCESS MESSAGE
    toast.success("Draft Updated!");
  };
  // REMOVE REACTION HANDLER
  const removeReaction = async (messageId) => {
    try {
      const response = await axios.delete(
        `${CHAT_API_ENDPOINT}/message/${messageId}/deleteReaction`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING THE SUCCESS MESSAGE
        toast.success(response.data.message);
        // UPDATING THE MESSAGES TO UPDATE THE UI
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  reactions: m.reactions.filter((r) => r.user._id !== user._id),
                }
              : m
          )
        );
      }
    } catch (error) {
      console.log("Error Removing Reaction!", error);
      // TOASTING ERROR MESSAGE
      toast.error("Error Removing Reaction!");
    }
  };
  // STAR MESSAGE HANDLER
  const starMessage = async (messageId) => {
    try {
      const response = await axios.patch(
        `${CHAT_API_ENDPOINT}/message/${messageId}/star`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        // UPDATING MESSAGES LIST
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? response.data.messageObj : m))
        );
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.warn(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(
        error.response.data.message || "Error Performing the Action!"
      );
    }
  };
  // UNSTAR MESSAGE HANDLER
  const unstarMessage = async (messageId) => {
    try {
      const response = await axios.patch(
        `${CHAT_API_ENDPOINT}/message/${messageId}/unstar`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        // UPDATING MESSAGES LIST
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? response.data.messageObj : m))
        );
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.warn(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(
        error.response.data.message || "Error Performing the Action!"
      );
    }
  };
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
  // IF ROOM UNDEFINED
  if (room === undefined) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
        </div>
      </>
    );
  }
  // IF NO ROOM
  if (room === null) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> Room Not Found
          </span>
        </div>
      </>
    );
  }
  // SETTING OTHER CHAT PARTICIPANT
  const other = room.participants.find((p) => p._id !== user._id);
  // CHECKING IF THE OTHER PARTICIPANT IS ONLINE OR NOT
  const isOnline = onlineUsers.includes(other._id);
  // CHECKING THE LAST SEEN OF THE OTHER USER
  const lastSeenTime = lastSeen[other._id] || null;
  return (
    <>
      {/* CHAT ROOM PAGE MAIN WRAPPER */}
      <div className="relative flex flex-col h-screen w-full tracking-[0.5px]">
        {/* HEADER */}
        <div className="py-[0.5rem] sticky top-0 left-0 flex items-center justify-between bg-gray-100 sm:px-[1.5rem] px-[1rem] m-0">
          {/* TEXT & AVATAR */}
          <div className="flex items-center gap-[1rem]">
            <Avatar className="w-[74px] h-[74px] rounded-full">
              <AvatarImage
                src={other?.profile?.profilePhoto || PROFILE}
                alt={other.fullName}
                className="w-[74px] h-[74px]"
              />
            </Avatar>
            <div className="flex flex-col">
              <span className="text-color-DB text-[1.2rem] font-[600]">
                {other.fullName}
              </span>
              <span className="text-gray-500 text-sm">{room.job.title}</span>
              <span
                className={`text-xs ${
                  isOnline ? "text-green-400" : "text-red-400"
                } font-bold`}
              >
                {isOnline ? "Online" : "Offline"}{" "}
              </span>
              <span className="text-[0.65rem] text-gray-500">
                {!isOnline &&
                  lastSeenTime &&
                  `Last Seen — (${formatDistanceToNow(new Date(lastSeenTime), {
                    addSuffix: true,
                  })})`}
              </span>
            </div>
          </div>
          {/* ACTIONS POPOVER */}
          <Popover className="overflow-y-auto">
            <PopoverTrigger title="Chat Actions">
              <MoreHorizontal className="text-color-DB" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-center justify-center gap-[1rem] max-w-fit">
              {/* POPOVER HEADING */}
              <div className="w-full text-gray-500 font-[600] text-[1.2rem] border-b-2 border-gray-400 flex items-center justify-center gap-[0.5rem]">
                <MessageCircleMoreIcon />
                <h1>Chat Actions</h1>
              </div>
              {/* CONDITIONAL POPOVER CONTENT */}
              {popoverAction === "FIRST" ? (
                <>
                  <PopoverClose asChild>
                    <Button
                      onClick={() =>
                        navigate(
                          user?.role === "STUDENT"
                            ? `/jobs/description/${room.job._id}`
                            : `/admin/jobs/${room.job._id}/detail`
                        )
                      }
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Briefcase />
                      View Job
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={goToFirstMessage}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <ArrowUpToLineIcon />
                      Go To Top
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowSearch((prev) => !prev);
                        setSearchTerm("");
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Text />
                      Search by Text
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowDateSearch((prev) => !prev);
                        setSearchDate(new Date().toISOString().slice(0, 10));
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <CalendarDaysIcon />
                      Search by Date
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowJumpToDate((prev) => !prev);
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <CalendarSearchIcon />
                      Jump to Date
                    </Button>
                  </PopoverClose>
                  {/* POPOVER NEXT */}
                  <Button
                    onClick={() => setPopoverAction("SECOND")}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                  >
                    <ArrowRightCircleIcon />
                    More Actions
                  </Button>
                </>
              ) : (
                <>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowStarred((prev) => !prev);
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Star />
                      Starred Messages
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowMediaAndDocs((prev) => !prev);
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Image />
                      View Media & Docs
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowLinksModal((prev) => !prev);
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Globe />
                      View Links
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={() => {
                        setShowSchedule((prev) => !prev);
                      }}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <LucideClock />
                      Schedule Message
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      onClick={clearChat}
                      className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                    >
                      <Trash2Icon />
                      Clear Chat
                    </Button>
                  </PopoverClose>
                  {/* POPOVER PREVIOUS */}
                  <Button
                    onClick={() => setPopoverAction("FIRST")}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem]"
                  >
                    <ArrowLeftCircleIcon />
                    Previous Actions
                  </Button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
        {/* STICKY DATE */}
        {stickyDate && (
          <div className="flex items-center justify-center">
            <div className="absolute top-[7rem] flex items-center justify-center">
              <span className="bg-gray-100 rounded-md px-2 py-1 text-color-DB font-[600] text-xs mr-[0.90rem]">
                {stickyDate}
              </span>
            </div>
          </div>
        )}
        {/* MESSAGES SEARCH BY TEXT MODAL */}
        {showSearch && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Search size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600] ">Search Messages</h1>
                <span className="flex items-center justify-center">
                  <Text size={35} className="text-color-DB" />
                </span>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm("");
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* SEARCH INPUT */}
            <div className="w-full">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Messages ..."
                className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
              />
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN NOT SEARCHING */}
              {searchTerm === "" && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 bg-white/80 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500">
                    <Search className="text-color-DB" />
                    Search Results will Appear Here
                  </span>
                </div>
              )}
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {searchTerm !== "" &&
                filtered.length > 0 &&
                filtered.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => {
                      scrollToMessage(m._id);
                      setShowSearch(false);
                    }}
                    title="View in Chat"
                    className="w-full bg-gray-200 rounded-lg p-3 flex flex-col cursor-pointer"
                  >
                    <span className="text-[1.2rem] text-gray-500">
                      {m.text}
                    </span>
                    <span className="text-sm text-color-DB font-[600]">
                      {m.sender.fullName}
                    </span>
                    <span className="text-xs text-gray-500 font-[600]">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                ))}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {searchTerm !== "" && filtered.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 bg-white/80 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500">
                    <X className="text-color-DB" />
                    No Search Results
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* MESSAGES SEARCH BY DATE MODAL */}
        {showDateSearch && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Search size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600] ">Search Messages</h1>
                <span className="flex items-center justify-center">
                  <Calendar size={35} className="text-color-DB" />
                </span>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowDateSearch(false);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* SEARCH INPUT */}
            <div className="w-full">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
              />
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {searchDate !== "" &&
                dateMatches.length > 0 &&
                dateMatches.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => {
                      scrollToMessage(m._id);
                      setShowDateSearch(false);
                    }}
                    title="View in Chat"
                    className="w-full bg-gray-200 rounded-lg p-3 flex flex-col cursor-pointer"
                  >
                    <span className="text-[1.2rem] text-gray-500">
                      {m.text}
                    </span>
                    <span className="text-sm text-color-DB font-[600]">
                      {m.sender.fullName}
                    </span>
                    <span className="text-xs text-gray-500 font-[600]">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                ))}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {searchDate !== "" && dateMatches.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500 bg-white/80">
                    <X className="text-color-DB" />
                    No Search Results For this Date
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* JUMP TO DATE MODAL */}
        {showJumpToDate && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <CalendarSearchIcon size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600] ">Jump to Date</h1>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowJumpToDate(false);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* UNIQUE DATES COUNTER */}
            <div className="flex items-center gap-[0.5rem] text-[1.45rem]">
              <span>
                <LucideChartBarIncreasing size={30} className="text-color-DB" />
              </span>
              <h1 className="text-color-MAIN font-[600]">
                Results{" "}
                <span className="bg-gray-200 text-color-DB px-3 py-1 rounded-md text-center">
                  {uniqueDates?.length || 0}
                </span>
              </h1>
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {uniqueDates.length > 0 &&
                uniqueDates.map((iso) => {
                  const date = new Date(iso);
                  const todayISO = new Date().toISOString().slice(0, 10);
                  const dividerLabel =
                    iso === todayISO
                      ? "Today"
                      : date.toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                  return (
                    <div
                      title="Go to Date"
                      key={iso}
                      onClick={() => {
                        const el = dateDividerRefs.current[iso];
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        setShowJumpToDate(false);
                      }}
                      className="bg-gray-200 p-3 rounded-md cursor-pointer w-full text-gray-500 text-[1.2rem] flex flex-col items-start justify-center"
                    >
                      <span>{dividerLabel}</span>
                      <span className="text-color-DB text-sm font-[600]">
                        Messages Count :{" "}
                        <span className="text-gray-500">{dateCounts[iso]}</span>
                      </span>
                    </div>
                  );
                })}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {uniqueDates.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 bg-white/80 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500">
                    <X className="text-color-DB" />
                    No Dates to Jump To Available
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* MEDI AND DOCS MODAL */}
        {showMediaAndDocs && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Image size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600]">
                  Chat Media & Docs
                </h1>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowMediaAndDocs(false);
                    setMediaAndDocsTab("MEDIA");
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* TABS SECTION */}
            <div className="flex items-center gap-[1rem]">
              <Button
                onClick={() => setMediaAndDocsTab("MEDIA")}
                className="bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem] w-fit"
              >
                <Image />
                Media {mediaMessages.length}
              </Button>
              <Button
                onClick={() => setMediaAndDocsTab("DOCS")}
                className="bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem] w-fit"
              >
                <FileText />
                Docs {documentMessages.length}
              </Button>
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {(mediaAndDocsTab === "MEDIA"
                ? mediaMessages
                : documentMessages
              ).map((m) => (
                <div
                  key={m._id}
                  onClick={() => {
                    scrollToMessage(m._id);
                    setShowMediaAndDocs(false);
                    setMediaAndDocsTab("MEDIA");
                  }}
                  title="View in Chat"
                  className="w-full bg-gray-200 rounded-lg p-3 flex flex-col items-start cursor-pointer"
                >
                  {mediaAndDocsTab === "MEDIA" ? (
                    <img
                      src={
                        m.attachments.find((a) =>
                          a.contentType.startsWith("image/")
                        ).url
                      }
                      alt=""
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <FileText size={40} className="text-color-DB" />
                  )}
                  {mediaAndDocsTab === "DOCS" && (
                    <a
                      href={
                        m.attachments.find(
                          (a) => !a.contentType.startsWith("image/")
                        ).url
                      }
                      target="_blank"
                      title="Open"
                      rel="noopener noreferrer"
                      className="text-gray-500 font-[600] text-[1.1rem] underline underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {
                        m.attachments.find(
                          (a) => !a.contentType.startsWith("image/")
                        ).filename
                      }
                    </a>
                  )}
                  {m.text && (
                    <span className="text-[1.2rem] text-gray-500">
                      {m.text}
                    </span>
                  )}
                  <span className="text-sm text-color-DB font-[600]">
                    {m.sender.fullName}
                  </span>
                  <span className="text-xs text-gray-500 font-[600]">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              ))}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {(mediaAndDocsTab === "MEDIA" ? mediaMessages : documentMessages)
                .length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500 bg-white/80">
                    <X className="text-color-DB" />
                    No {mediaAndDocsTab === "MEDIA"
                      ? "Media"
                      : "Documents"}{" "}
                    Shared in the Chat
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* LINK MESSAGES MODAL */}
        {showLinksModal && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Globe size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600]">Chat Links</h1>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowLinksModal(false);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {linkMessages.length > 0 &&
                linkMessages.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => {
                      scrollToMessage(m._id);
                      setShowLinksModal(false);
                    }}
                    title="View in Chat"
                    className="w-full bg-gray-200 rounded-lg p-3 flex flex-col cursor-pointer"
                  >
                    <span className="text-[1.2rem] text-gray-500">
                      {m.text}
                    </span>
                    <span className="text-sm text-color-DB font-[600]">
                      {m.sender.fullName}
                    </span>
                    <span className="text-xs text-gray-500 font-[600]">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                ))}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {searchDate !== "" && linkMessages.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500 bg-white/80">
                    <X className="text-color-DB" />
                    No Links Shared in the Chat
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* SCHEDULE MESSAGES MODAL */}
        {showSchedule && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start z-[9999]">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Clock size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600] ">
                  Schedule Messages
                </h1>
                <span className="flex items-center justify-center">
                  <Text size={35} className="text-color-DB" />
                </span>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowSchedule(false);
                    setEditingID(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* TEXTAREA */}
            {!editingID && (
              <textarea
                value={scheduledText}
                onChange={(e) => setScheduledText(e.target.value)}
                placeholder="Your Message ..."
                className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
              />
            )}
            {/* DATE INPUT */}
            {!editingID && (
              <div className="w-full">
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
                />
              </div>
            )}
            {/* CREATE SCHEDULE BUTTON */}
            {!editingID && (
              <Button
                onClick={createScheduledMessage}
                disabled={!scheduledText.trim()}
                className="bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none text-[1rem] w-full"
              >
                {localLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle />
                )}
                {localLoading ? "Creating Message" : "Create Message"}
              </Button>
            )}
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg max-h-fit flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {scheduledList.length > 0 &&
                scheduledList.map((m) => {
                  const isEditing = m._id === editingID;
                  return (
                    <div
                      key={m._id}
                      onClick={() => {
                        scrollToMessage(m._id);
                        setShowSearch(false);
                      }}
                      title="Scheduled Message"
                      className={`w-full flex flex-col gap-[0.3rem] ${
                        !isEditing
                          ? "bg-gray-200 rounded-lg p-3 cursor-pointer"
                          : ""
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex flex-col items-start justify-center gap-[0.5rem]">
                          {/* HEADING */}
                          <div className="flex items-center gap-[0.5rem] text-[1.2rem]">
                            <Edit size={35} className="text-color-DB" />
                            <h1 className="text-color-MAIN font-[600] ">
                              Edit Message
                            </h1>
                          </div>
                          {/* TEXTAREA */}
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            placeholder="Your Message ..."
                            className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
                          />
                          {/* DATE INPUT */}
                          <div className="w-full">
                            <input
                              type="datetime-local"
                              value={editingDate}
                              onChange={(e) => setEditingDate(e.target.value)}
                              className="border-2 border-gray-300 outline-none focus:outline-none px-[1rem] py-[1rem] rounded-lg w-full bg-gray-200 text-gray-500"
                            />
                          </div>
                          <div className="flex items-center gap-[1rem]">
                            <button
                              title="Save Message"
                              onClick={handleScheduledSave}
                              className="max-w-fit"
                            >
                              <Save size={40} className="text-gray-500" />
                            </button>
                            <button
                              title="Cancel"
                              onClick={() => setEditingID(null)}
                              className="max-w-fit"
                            >
                              <X size={40} className="text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-[1.2rem] text-gray-500">
                            {m.text}
                          </span>
                          <time className="text-sm text-color-DB font-[600]">
                            <span>
                              Scheduled Time :{" "}
                              {new Date(m.sendAt).toLocaleString()}
                            </span>
                          </time>
                          <span className="text-sm text-color-DB font-[600]">
                            {m.sender.fullName}
                          </span>
                          <div className="flex items-center gap-[0.5rem]">
                            <button
                              title="Delete Message"
                              onClick={() => cancelScheduledMessage(m._id)}
                              className="max-w-fit"
                            >
                              <Trash2 size={25} className="text-gray-500" />
                            </button>
                            <button
                              title="Edit Message"
                              onClick={() => startScheduledEdit(m)}
                              className="max-w-fit"
                            >
                              <Edit size={25} className="text-gray-500" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {scheduledList.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 bg-white/80 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500">
                    <X className="text-color-DB" />
                    No Scheduled Messages Currently
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* STARRED MESSAGES MODAL */}
        {showStarred && (
          <div className="absolute top-[6.5rem] left-1/2 transform -translate-x-1/2 sm:w-[90%] w-[95%] bg-gray-100 sm:px-[2rem] px-[1rem] py-[1rem] rounded-lg flex flex-col gap-[1rem] justify-center items-start">
            {/* HEADING & CLOSE BUTTON */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem] text-[1.5rem]">
                <Star size={35} className="text-color-DB" />
                <h1 className="text-color-MAIN font-[600] ">
                  Starred Messages
                </h1>
              </div>
              <div>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Close"
                  onClick={() => {
                    setShowStarred(false);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* RESULTS SECTION */}
            <div className="w-full overflow-y-auto border-2 border-gray-300 py-[1rem] px-[1rem] rounded-lg h-60 flex flex-col gap-[0.75rem] justify-start items-center">
              {/* WHEN SEARCHING & THERE ARE RESULTS */}
              {starredMessages.length > 0 &&
                starredMessages.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => {
                      scrollToMessage(m._id);
                      setShowStarred(false);
                    }}
                    title="View in Chat"
                    className="w-full bg-gray-200 rounded-lg p-3 flex flex-col cursor-pointer"
                  >
                    <span className="text-[1.2rem] text-gray-500">
                      {m.text}
                    </span>
                    <span className="text-sm text-color-DB font-[600]">
                      {m.sender.fullName}
                    </span>
                    <span className="text-xs text-gray-500 font-[600]">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                ))}
              {/* WHEN SEARCHING & THERE ARE NO RESULTS */}
              {starredMessages.length <= 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-2 bg-white/80 text-center rounded-lg flex items-center gap-[0.5rem] text-gray-500">
                    <X className="text-color-DB" />
                    No Starred Messages
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* MESSAGES CONTAINER */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto sm:px-[1.5rem] px-[1rem] py-[1rem] space-y-3 bg-white"
        >
          {/* MESSAGES SECTION */}
          {messages?.map((m, i) => {
            // SELECTING THE ME USER
            const mine = m.sender._id === user._id;
            // OTHER USER READ STATUS
            const isReadByOther = mine && m?.readBy?.includes(other._id);
            // MESSAGE REACTION
            const myReaction = m.reactions.find((r) => r.user._id === user._id);
            // DATE DATA FOR STICKY DATE BADGE
            const dataKey = new Date(m.createdAt).toISOString().slice(0, 10);
            // INLINE DATE DIVIDER LOGIC
            const prevDate =
              i > 0
                ? new Date(messages[i - 1].createdAt).toISOString().slice(0, 10)
                : null;
            const showDivider = prevDate !== dataKey;
            const todayISO = new Date().toISOString().slice(0, 10);
            const dividerLabel =
              dataKey === todayISO
                ? "Today"
                : new Date(dataKey).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
            return (
              <>
                {/* DATE DIVIDER BETWEEN MESSAGES */}
                {showDivider && (
                  <div
                    ref={(el) => {
                      if (el) dateDividerRefs.current[dataKey] = el;
                    }}
                    className="flex items-center justify-center w-full"
                  >
                    <span className="text-gray-500 text-xs font-[600] px-2 py-1 bg-gray-100 rounded-md flex items-center justify-center">
                      {dividerLabel}
                    </span>
                  </div>
                )}
                {/* MESSAGES */}
                <div
                  key={m._id}
                  ref={(el) => (messagesRef.current[m._id] = el)}
                  data-date={dataKey}
                  className={`flex items-center ${
                    mine ? "justify-end" : "justify-start"
                  } rounded-md`}
                >
                  {/* MESSAGE REACTION */}
                  {reactingTo === m._id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                      <div
                        ref={pickerRef}
                        className="bg-white rounded-lg p-4 shadow-lg"
                      >
                        <Picker
                          onEmojiClick={async (emojiObject) => {
                            try {
                              const response = await axios.patch(
                                `${CHAT_API_ENDPOINT}/message/${m._id}/react`,
                                { emoji: emojiObject.emoji },
                                { withCredentials: true }
                              );
                              // IF RESPONSE SUCCESS
                              if (response.data.success) {
                                // TOASTING SUCCESS MESSAGE
                                toast.success(response.data.message);
                              }
                            } catch (error) {
                              console.log("Error Reacting to Message!", error);
                              // TOASTING ERROR MESSAGE
                              toast.error("Error Reacting to Message!");
                            } finally {
                              // CLOSING REACTION PICKER
                              setReactingTo(null);
                            }
                          }}
                          height={350}
                        />
                      </div>
                    </div>
                  )}
                  {/* MESSAGE ACTION POPOVER */}
                  {mine && (
                    <Popover>
                      <PopoverTrigger title="Message Actions">
                        <MoreVertical size={20} className="text-color-DB" />
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col items-center justify-center gap-[0.5rem] max-w-fit">
                        {/* POPOVER HEADING */}
                        <div className="w-full text-gray-500 font-[600] text-[1rem] border-b-2 border-gray-400 flex items-center justify-center gap-[0.5rem]">
                          <MessageSquareMoreIcon />
                          <h1>Message Actions</h1>
                        </div>
                        {m.pending ? (
                          <>
                            <span
                              onClick={() => deletePending(m._id)}
                              className="w-full flex items-center justify-center gap-[0.5rem] text-sm bg-gray-100 rounded-md p-[0.5rem] text-gray-500 cursor-pointer"
                            >
                              <Trash2Icon size={20} className="text-color-DB" />{" "}
                              Delete Draft
                            </span>
                            <span
                              onClick={() => editPending(m)}
                              className="w-full flex items-center justify-center gap-[0.5rem] text-sm bg-gray-100 rounded-md p-[0.5rem] text-gray-500 cursor-pointer"
                            >
                              <Trash2Icon size={20} className="text-color-DB" />{" "}
                              Edit Draft
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              onClick={() => deleteForMe(m._id)}
                              className="w-full flex items-center justify-center gap-[0.5rem] text-sm bg-gray-100 rounded-md p-[0.5rem] text-gray-500 cursor-pointer"
                            >
                              <Trash2Icon size={20} className="text-color-DB" />{" "}
                              Delete for Me
                            </span>
                            <span
                              onClick={() => deleteForEveryone(m._id)}
                              className="w-full flex items-center justify-center gap-[0.5rem]  bg-gray-100 rounded-md p-[0.5rem] text-gray-500 cursor-pointer text-sm"
                            >
                              <Trash2Icon size={20} className="text-color-DB" />{" "}
                              Delete for All
                            </span>
                            <span
                              onClick={() => handleEdit(m)}
                              className="w-full flex items-center justify-center gap-[0.5rem] text-sm bg-gray-100 rounded-md p-[0.5rem] text-gray-500 cursor-pointer"
                            >
                              <Edit size={20} className="text-color-DB" /> Edit
                              Message
                            </span>
                          </>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                  {/* MESSAGE BODY */}
                  <div
                    className={`flex flex-col items-end justify-center max-w-[70%] p-2 rounded-lg ${
                      mine
                        ? "bg-color-LB text-white"
                        : "bg-color-LBR text-white"
                    }`}
                  >
                    {/* MESSAGE PARENT SECTION */}
                    {m.parent && (
                      <div
                        title="View Original"
                        className="flex flex-col w-full bg-white/60 rounded-lg p-2 text-gray-500 justify-center items-end cursor-pointer"
                        onClick={() => scrollToMessage(m?.parent._id)}
                      >
                        <span>{m.parent.text}</span>
                        <span className="text-xs text-color-DB font-[600]">
                          {m.parent?.sender?.fullName}
                        </span>
                        <span className="text-[0.65rem] text-gray-500 font-[600]">
                          {new Date(m.parent.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                    )}
                    {/* MESSAGE ORIGINAL TEXT */}
                    <p
                      className={`w-full text-left ${m?.parent ? "pt-2" : ""}`}
                    >
                      {m.text}
                    </p>
                    {/* MESSAGE ATTACHMENTS */}
                    {m.attachments?.map((att, i) => (
                      <div key={i} className="mt-2">
                        {att.contentType.startsWith("image/") ? (
                          <div className="bg-white/60 rounded-md p-3">
                            <img
                              src={att.url}
                              alt={att.filename}
                              className="h-[20rem] object-contain"
                            />
                          </div>
                        ) : (
                          <a
                            href={att.url}
                            target="_blank"
                            download={att.filename}
                            title="View"
                          >
                            <span className="flex flex-col gap-[0.5rem] items-center justify-center bg-white/60 rounded-md p-2">
                              <FileText size={40} className="text-gray-500" />
                              <span className="text-gray-500 underline underline-offset-4 text-sm font-[600]">
                                {att.filename}
                              </span>
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                    {/* LIVE PREVIEW IN CASE OF METADATA FOUND OTHERWISE SIMPLE LINK */}
                    {m.preview &&
                    m.preview.title !== "" &&
                    m.preview.description !== "" &&
                    m.preview.image !== "" ? (
                      <a
                        title="Visit Website"
                        href={m.preview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/60 rounded-md p-2 mt-3 mb-3 flex flex-col items-start justify-center gap-[0.75rem]"
                      >
                        {m.preview.image && (
                          <div className="w-full items-center justify-center flex">
                            <img
                              src={m.preview.image}
                              alt="Banner"
                              className="w-full h-32 object-contain"
                            />
                          </div>
                        )}
                        {m.preview.title && (
                          <h1 className="text-gray-500 font-[600] text-[1.1rem] uppercase underline underline-offset-4 w-full text-center">
                            {m.preview.title}
                          </h1>
                        )}
                        {m.preview.description && (
                          <h4 className="text-gray-500 w-full text-center">
                            {m.preview.description}
                          </h4>
                        )}
                      </a>
                    ) : (
                      m.preview && (
                        <a
                          title="Visit Website"
                          href={m.preview.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/60 p-2 flex flex-col items-center justify-center rounded-md my-3 w-full"
                        >
                          <h4 className="font-[600] text-[1.1rem] text-gray-500">
                            Visit Website
                          </h4>
                          <span className="text-gray-500 underline underline-offset-4">
                            {m.preview.url}
                          </span>
                        </a>
                      )
                    )}
                    {/* MESSAGE DETAILS */}
                    <div className="flex items-center justify-end gap-[0.5rem] text-xs mt-1 text-white text-right">
                      {/* EDITED FLAG */}
                      {m.edited && <span>Edited</span>}
                      {/* DATE */}
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      {/* PENDING MESSAGE FLAG */}
                      {m.pending && (
                        <span title="Pending">
                          <Clock size={15} />
                        </span>
                      )}
                      {/* STARRED */}
                      {m.starredBy?.length > 0 &&
                        m.starredBy.includes(user._id) && (
                          <span title="Starred">
                            <Star size={20} />
                          </span>
                        )}
                      {/* READ LOGIC */}
                      {mine && !m.pending && (
                        <span className="text-color-DB">
                          {isReadByOther ? "✔✔" : "✔"}
                        </span>
                      )}
                    </div>
                    {/* MESSAGE ACTIONS */}
                    <div
                      className={`flex items-center justify-end gap-[0.5rem] mt-[0.5rem] p-1 rounded-md bg-white/70 w-fit ${
                        mine ? "text-color-DB" : "text-color-MAIN"
                      } w-full`}
                    >
                      {/* MESSAGE INFO */}
                      <span
                        title="Info"
                        className="cursor-pointer p-1 bg-white flex items-center justify-center rounded-full"
                      >
                        <InfoIcon size={20} />
                      </span>
                      {/* MESSAGE REACTION */}
                      <span
                        title={myReaction ? "Change Reaction" : "Add Reaction"}
                        onClick={() => setReactingTo(m._id)}
                        className="cursor-pointer p-1 bg-white flex items-center justify-center rounded-full"
                      >
                        <Sticker size={20} />
                      </span>
                      {/* MESSAGE STAR */}
                      <span
                        title={
                          m.starredBy?.includes(user._id)
                            ? "Unstar Message"
                            : "Star Message"
                        }
                        onClick={() =>
                          m.starredBy.includes(user._id)
                            ? unstarMessage(m._id)
                            : starMessage(m._id)
                        }
                        className="cursor-pointer p-1 bg-white flex items-center justify-center rounded-full"
                      >
                        <Star size={20} />
                      </span>
                      {/* MESSAGE REPLY */}
                      <span
                        onClick={() => setReplyTo(m)}
                        title="Reply"
                        className="cursor-pointer p-1 bg-white flex items-center justify-center rounded-full"
                      >
                        <LucideMessageSquareReply size={20} />
                      </span>
                    </div>
                  </div>
                  {/* MESSAGE REACTION & REPLY TO OTHER'S MESSAGES */}
                  {!mine && (
                    <Popover>
                      <PopoverTrigger title="Message Actions">
                        <MoreVertical size={20} className="text-color-MAIN" />
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col items-center justify-center gap-[0.5rem] max-w-fit">
                        {/* POPOVER HEADING */}
                        <div className="w-full text-gray-500 font-[600] text-[1rem] border-b-2 border-gray-400 flex items-center justify-center gap-[0.5rem]">
                          <MessageSquareMoreIcon />
                          <h1>Message Actions</h1>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                {/* MESSAGE REACTION */}
                {m.reactions.length > 0 && (
                  <div
                    className={`flex items-center ${
                      mine ? "justify-start flex-row-reverse" : "justify-start"
                    } gap-1`}
                  >
                    {m.reactions.map((r, index) => (
                      <span
                        title={r.user._id === user._id ? "You" : other.fullName}
                        className="flex items-center justify-center h-[2.5rem] w-[2.5rem] text-[1.4rem] bg-gray-200 rounded-full"
                        key={index}
                      >
                        <span>{r.emoji}</span>
                      </span>
                    ))}
                    {/* REMOVE MESSAGE REACTION */}
                    {myReaction && (
                      <span
                        title="Remove Reaction"
                        onClick={() => removeReaction(m._id)}
                        className="ml-2 bg-gray-200 rounded-full flex items-center justify-center h-[2.2rem] w-[2.2rem] text-[1.2rem] cursor-pointer text-gray-600"
                      >
                        <Trash2Icon />
                      </span>
                    )}
                  </div>
                )}
              </>
            );
          })}
          {/* END DIV TO HELP SCROLL */}
          <div ref={endRef} />
        </div>
        {/* TYPING BUBBLE */}
        <TypingBubble
          other={other.fullName}
          show={otherInRoom && otherTyping}
        />
        {/* PRESENCE BUBBLE */}
        <PresenceBubble
          other={other.fullName}
          show={otherInRoom && !otherTyping}
        />
        {/* REPLY BAR */}
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex items-center justify-center sticky bottom-0 left-0 py-[0.5rem] sm:px-[1.5rem] px-[1rem]"
          >
            <div className="md:w-3/4 w-full flex flex-col items-center justify-center relative bg-gray-100 rounded-lg py-2">
              <div className="flex items-center justify-between w-full px-3 py-4">
                <h1 className="flex text-gray-500 text-[1.1rem] gap-1">
                  <span className="flex items-center gap-1">
                    <Reply size={25} /> Replying to
                  </span>
                  <span className="text-color-DB font-[600]">
                    {replyTo.sender.fullName}
                  </span>
                  :
                </h1>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Cancel"
                  onClick={() => setReplyTo(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="w-full px-3 pb-3">
                <div className="w-full p-4 rounded-lg bg-gray-200 text-gray-500">
                  {replyTo.text.length > 60
                    ? replyTo.text.slice(0, 30) + "..."
                    : replyTo.text}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* FILE PREVIEW */}
        {filePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex items-center justify-center sticky bottom-0 left-0 py-[0.5rem] sm:px-[1.5rem] px-[1rem]"
          >
            <div className="md:w-3/4 w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg py-2">
              <div className="px-3 py-2 w-full flex items-center justify-between">
                <h1 className="flex items-center gap-[0.5rem] text-gray-500 font-[600] text-[1.1rem]">
                  <PaperclipIcon />
                  <span>Attachment</span>
                </h1>
                <button
                  className="text-gray-500 bg-gray-300 hover:bg-gray-200 rounded-md p-1"
                  title="Cancel"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                >
                  <X />
                </button>
              </div>
              {/* IF FILE IS AN IMAGE */}
              {filePreview.type === "image" ? (
                <img
                  src={filePreview.url}
                  alt="Preview"
                  className="h-[12rem]"
                />
              ) : (
                <div className="w-fit flex flex-col items-center justify-center gap-[0.5rem]">
                  <span>
                    <img src={PDF} alt="Pdf" className="h-[6rem]" />
                  </span>
                  <span className="text-gray-500 font-[600]">
                    {filePreview.name}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* SCROLL TO BOTTOM BUTTON */}
        <AnimatePresence>
          {scrollDown && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                const c = messagesContainerRef.current;
                if (c) {
                  c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
                }
              }}
              className="fixed md:bottom-2 bottom-16 right-6 z-50 bg-color-DB hover:bg-color-LB p-2 rounded-full shadow-lg text-white"
              title="Scroll to Bottom"
            >
              <ArrowDown size={25} />
            </motion.button>
          )}
        </AnimatePresence>
        {/* SEND MESSAGE CONTROLS */}
        <div className="w-full flex items-center justify-center sticky bottom-0 left-0 py-[0.5rem] sm:px-[1.5rem] px-[1rem]">
          <div className="md:w-3/4 w-full flex items-center justify-center relative bg-gray-100 rounded-full">
            {/* EMOJI PICKER BUTTON */}
            <button
              title="Insert Emoji"
              className="pl-2 text-[1.3rem]"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              🙂
            </button>
            {/* EMOJI PICKER */}
            {emojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <Picker
                  onEmojiClick={(emojiObject) => {
                    setDraft((prev) => prev + emojiObject.emoji);
                  }}
                  height={350}
                />
              </div>
            )}
            {/* FILE UPLOAD */}
            <label
              title="Attachments"
              htmlFor="file-upload"
              className="ml-2 cursor-pointer"
            >
              <PaperclipIcon />
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              id="file-upload"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* MESSAGE INPUT */}
            <input
              type="text"
              value={draft}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a Message ..."
              className="ps-[1rem] text-gray-700 flex-1 py-2 focus:outline-none bg-gray-100 rounded-full"
            />
            {/* SEND MESSAGE BUTTON */}
            <Button
              onClick={send}
              className="right-3 absolute w-[2rem] h-[2rem] rounded-full p-4 bg-color-DB hover:bg-color-LB text-white"
            >
              <SendHorizonalIcon />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoomPage;
