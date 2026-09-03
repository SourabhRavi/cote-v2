import { Router } from "express";
import {
  validateChannelCreate,
  validateChannelId,
  validateChannelUpdate,
  validateChannelWorkspaceId,
} from "./channel.middleware.js";

import {
  createChannel,
  getChannel,
  getChannels,
  joinChannel,
  leaveChannel,
  updateChannel,
  deleteChannel,
} from "./channel.service.js";

const router = Router();

router.post("/", validateChannelCreate, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId, channelName } = req.body;

  try {
    const channel = await createChannel({
      userId,
      workspaceId,
      channelName,
    });

    return res.status(201).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Failed to create channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create channel.",
    });
  }
});

router.get("/", validateChannelWorkspaceId, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId } = req.query;

  try {
    const channels = await getChannels({
      userId,
      workspaceId,
    });

    return res.status(200).json({
      success: true,
      data: channels,
    });
  } catch (error) {
    console.error("Failed to fetch channels:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch channels.",
    });
  }
});

router.get("/:channelId", validateChannelId, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;

  try {
    const channel = await getChannel({
      userId,
      channelId,
    });

    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Failed to fetch channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch channel.",
    });
  }
});

router.post("/:channelId/join", validateChannelId, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;

  try {
    const channelMember = await joinChannel({
      userId,
      channelId,
    });

    return res.status(200).json({
      success: true,
      data: channelMember,
    });
  } catch (error) {
    console.error("Failed to join channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join channel.",
    });
  }
});

router.delete("/:channelId/leave", validateChannelId, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;

  try {
    await leaveChannel({
      userId,
      channelId,
    });

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Failed to leave channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave channel.",
    });
  }
});

router.patch("/:channelId", validateChannelUpdate, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;
  const { channelName } = req.body;

  try {
    const channel = await updateChannel({
      userId,
      channelId,
      channelName,
    });

    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Failed to update channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update channel.",
    });
  }
});

router.delete("/:channelId", validateChannelId, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;

  try {
    await deleteChannel({
      userId,
      channelId,
    });

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Failed to delete channel:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete channel.",
    });
  }
});

export default router;
