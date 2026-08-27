import { z } from "zod";

export const workspaceIdSchema = z.object({
  workspaceId: z.uuidv7(),
});

export const workspaceUpdateSchema = z.object({
  name: z.string().min(1),
});

export const workspaceMemberCreateSchema = z.object({
  userId: z.uuidv7(),
  role: z.enum(["admin", "member"]),
});
