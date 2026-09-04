import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.emit("channel:join", "XYZ_CHANNEL_ID");
socket.emit("channel:leave", "XYZ_CHANNEL_ID");
