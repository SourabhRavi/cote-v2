import { Router } from "express";
import {
  validateMessageChannelId,
  validateMessageId,
  validateMessageSend,
  validateMessageUpdate,
} from "./message.middleware.js";
import {
  deleteMessage,
  getMessages,
  sendMessage,
  updateMessage,
} from "./message.service.js";
import { SOCKET_EVENTS } from "../../socket/socket-events.js";

const router = Router();

router.post("/", validateMessageSend, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId, content } = req.body;

  try {
    const message = await sendMessage({
      userId,
      channelId,
      content,
    });

    // broadcast updated message to channel room
    const io = req.app.get("io");
    io.to(channelId).emit(SOCKET_EVENTS.MESSAGE_UPDATE, message);

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Failed to send message:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

router.get("/", validateMessageChannelId, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId, cursor } = req.query;
  const limit = Number(req.query.limit ?? 20);

  try {
    const messages = await getMessages({
      userId,
      channelId,
      cursor,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
});

router.patch("/:messageId", validateMessageUpdate, async (req, res) => {
  const { id: userId } = req.user;
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await updateMessage({
      userId,
      messageId,
      content,
    });

    const io = req.app.get("io");

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Failed to update message:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
});

router.delete("/:messageId", validateMessageId, async (req, res) => {
  const { id: userId } = req.user;
  const { messageId } = req.params;

  try {
    await deleteMessage({
      userId,
      messageId,
    });

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Failed to delete message:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
});

export default router;
