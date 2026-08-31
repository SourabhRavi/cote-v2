import z from "zod";
import {
  messageChannelIdSchema,
  messageIdSchema,
  messageSendSchema,
  messageUpdateSchema,
} from "./message.schema.js";

export const validateMessageSend = (req, res, next) => {
  const result = messageSendSchema.safeParse(req.body);

  if (!result.success) {
    console.error("Invalid message:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid message.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateMessageChannelId = (req, res, next) => {
  const result = messageChannelIdSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel ID.",
      errors: result.error,
    });
  }

  next();
};

export const validateMessageUpdate = (req, res, next) => {
  const result = messageUpdateSchema.safeParse({
    ...req.params,
    ...req.body,
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid message data.",
      errors: result.error,
    });
  }

  next();
};

export const validateMessageId = (req, res, next) => {
  const result = messageIdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid message ID.",
      errors: result.error,
    });
  }

  next();
};
