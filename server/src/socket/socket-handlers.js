import { markChannelAsRead } from "../modules/channel/channel.service.js";
import { db } from "../prisma/db.ts";
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

  // socket starts typing in a channel
  socket.on(SOCKET_EVENTS.TYPING_START, async (channelId) => {
    try {
      const channelMember = await db.orm.public.ChannelMember.where({
        userId: socket.user.id,
        channelId: channelId,
      }).first();

      if (!channelMember) return;

      const user = socket.user;

      socket.to(channelId).emit(SOCKET_EVENTS.TYPING_START, {
        id: user.id,
        name: user.name,
      });
    } catch (error) {
      console.error("Fill to handle typing start:", error);
    }
  });

  // socket stops typing in a channel
  socket.on(SOCKET_EVENTS.TYPING_STOP, async (channelId) => {
    try {
      const channelMember = await db.orm.public.ChannelMember.where({
        userId: socket.user.id,
        channelId: channelId,
      }).first();

      if (!channelMember) return;

      const user = socket.user;

      socket.to(channelId).emit(SOCKET_EVENTS.TYPING_STOP, {
        id: user.id,
        name: user.name,
      });
    } catch (error) {
      console.error("Fill to handle typing stop:", error);
    }
  });
};
