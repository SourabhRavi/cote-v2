import z from "zod";

export const channelCreateSchema = z.object({
  workspaceId: z.uuidv7(),
  channelName: z.string(),
});

export const channelWorkspaceIdSchema = z.object({
  workspaceId: z.uuidv7(),
});

export const channelUpdateSchema = z.object({
  channelId: z.uuidv7(),
  channelName: z.string(),
});

export const channelIdSchema = z.object({
  channelId: z.uuidv7(),
});
