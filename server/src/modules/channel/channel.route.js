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
  updateChannel,
} from "./channel.service.js";

const router = Router();

router.post("/", validateChannelCreate, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId, name } = req.body;

  try {
    const channel = await createChannel({
      userId,
      workspaceId,
      name,
    });

    return res.status(201).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Failed to create channel:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to create channel.`,
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

    return res.status(201).json({
      success: true,
      data: channels,
    });
  } catch (error) {
    console.error("Failed to get channels:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to get channels.`,
    });
  }
});

router.get("/:channelId", validateChannelWorkspaceId, async (req, res) => {
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
    console.error("Failed to get channel:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to get channel.`,
    });
  }
});

router.get("/:channelId", validateChannelWorkspaceId, async (req, res) => {
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
    console.error("Failed to get channel:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to get channel.`,
    });
  }
});

router.patch("/:channelId", validateChannelUpdate, async (req, res) => {
  const { id: userId } = req.user;
  const { channelId } = req.params;
  const { name } = req.body;

  try {
    const channel = await updateChannel({
      userId,
      channelId,
      name,
    });

    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Failed to get channel:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to get channel.`,
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
      message: `Failed to delete channel.`,
    });
  }
});

export default router;
