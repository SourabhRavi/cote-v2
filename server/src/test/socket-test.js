import { io } from "socket.io-client";

const sessionToken =
  "c2f4abe55007b7f0afcfb006f691693d2616238797c61110c8adcd308f7d21af";

const socket = io("http://localhost:3000", {
  extraHeaders: {
    Cookie: `session=${sessionToken}`,
  },
});
socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});
