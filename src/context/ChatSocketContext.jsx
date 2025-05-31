// <= IMPORTS =>
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { createContext, useContext, useEffect, useState } from "react";

// INITIALIZING CONTEXT
const ChatSocketContext = createContext(null);

// CONTEXT FUNCTION
export function ChatSocketProvider({ children }) {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // SOCKET STATE
  const [socket, setSocket] = useState(null);
  // SOCKET CONNECTION HANDLING
  useEffect(() => {
    if (!user) return;
    // SOCKET URL
    const socketURL = "http://localhost:8000";
    // INITIALIZING SOCKET CONNECTION
    const s = io(socketURL, { withCredentials: true });
    // ON SOCKET CONNECTION
    s.on("connect", () => {
      console.log("Chat Socket Connected : ", s.id);
    });
    // SETTING SOCKET
    setSocket(s);
    // CLEANUP
    return () => {
      // DISCONNECTING SOCKET
      s.disconnect();
      console.log("Chat Socket Disconnected");
    };
  }, [user]);
  return (
    <ChatSocketContext.Provider value={socket}>
      {children}
    </ChatSocketContext.Provider>
  );
}

// CUSTOM HOOK
export function useChatSocket() {
  const socket = useContext(ChatSocketContext);
  if (socket === null) {
    throw new Error("useChatSocket must be used within ChatSocketProvider");
  }
  return socket;
}
