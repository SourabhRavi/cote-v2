import z from "zod";

export const messageSendSchema = z.object({
  channelId: z.uuidv7(),
  content: z.string().min(1).max(4000),
});

export const messageChannelIdSchema = z.object({
  channelId: z.uuidv7(),
  cursor: z.uuidv7().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const messageUpdateSchema = z.object({
  messageId: z.uuidv7(),
  content: z.string().min(1).max(4000),
});

export const messageIdSchema = z.object({
  messageId: z.uuidv7(),
});
