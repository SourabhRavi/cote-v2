import { SOCKET_EVENTS } from "./socket-events.js";

export const registerSocketHandlers = (io, socket) => {
  // socket joins a channel
  socket.on(SOCKET_EVENTS.CHANNEL_JOIN, (channelId) => {
    socket.join(channelId);
  });

  // socket leaves a channel
  socket.on(SOCKET_EVENTS.CHANNEL_LEAVE, (channelId) => {
    socket.leave(channelId);
  });
};
