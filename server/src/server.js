import "dotenv/config";
import app from "./app.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/socket-auth.middleware.js";
import { SOCKET_EVENTS } from "./socket/socket-events.js";
import { registerSocketHandlers } from "./socket/socket-handlers.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// set io object in app
app.set("io", io);

io.use(socketAuth);

io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  // register socket handlers
  registerSocketHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
