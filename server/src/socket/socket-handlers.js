import { markChannelAsRead } from "../modules/channel/channel.service.js";
import { SOCKET_EVENTS } from "./socket-events.js";

export const registerSocketHandlers = (io, socket) => {
  // socket joins a channel
  socket.on(SOCKET_EVENTS.CHANNEL_JOIN, async (channelId) => {
    try {
      socket.join(channelId);

      await markChannelAsRead({
        userId: socket.user.id,
        channelId,
      });
    } catch (error) {
      console.error("Failed to mark channel as read:", error);
    }
  });

  // socket leaves a channel
  socket.on(SOCKET_EVENTS.CHANNEL_LEAVE, (channelId) => {
    socket.leave(channelId);
  });
};
