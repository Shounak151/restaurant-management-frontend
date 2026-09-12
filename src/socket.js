import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const connectSocket = () => {
  const token = localStorage.getItem("tastybites_token");
  if (!token) {
    socket.disconnect();
    return false;
  }

  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
  return true;
};

export default socket;
