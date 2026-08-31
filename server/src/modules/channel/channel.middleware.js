import z from "zod";
import {
  channelCreateSchema,
  channelIdSchema,
  channelUpdateSchema,
  channelWorkspaceIdSchema,
} from "./channel.schema.js";

export const validateChannelCreate = (req, res, next) => {
  const result = channelCreateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel data.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateChannelWorkspaceId = (req, res, next) => {
  const result = channelWorkspaceIdSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid workspace ID.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateChannelId = (req, res, next) => {
  const result = channelIdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel data.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateChannelUpdate = (req, res, next) => {
  const result = channelUpdateSchema.safeParse({
    ...req.params,
    ...req.body,
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel data.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};
