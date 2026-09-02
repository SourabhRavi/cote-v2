import "dotenv/config";
import app from "./app.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { socketAuth } from "./socket/socket.auth.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);

const io = new Server(server);

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  console.log("Authenticated user:", socket.user.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
