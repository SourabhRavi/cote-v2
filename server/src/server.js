import "dotenv/config";
import app from "./app.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/socket-auth.middleware.js";
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

io.use(socketAuthMiddleware);

// userId → Set of active socket IDs
//
// Example:
//
// {
//   "user-123" → Set(["socket-a", "socket-b"]),
//   "user-456" → Set(["socket-c"])
// }
// map of all the active sockets of all active users
const userSockets = new Map();

io.on("connection", (socket) => {
  // register socket handlers
  const userId = socket.user.id;

  // check whether this user already has active sockets
  const sockets = userSockets.get(userId);

  if (sockets) {
    // user already has another tab/device connected.
    sockets.add(socket.id);
  } else {
    // this is the user's first active socket
    userSockets.set(userId, new Set([socket.id]));

    // only broadcast ONLINE when the user was previously offline
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
      userId,
    });
  }

  // Register all socket-specific handlers.
  registerSocketHandlers(io, socket, userSockets);
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
