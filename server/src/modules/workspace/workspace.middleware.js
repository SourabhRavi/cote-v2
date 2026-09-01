import z from "zod";

import {
  workspaceIdSchema,
  workspaceMemberCreateSchema,
  workspaceMemberDeleteSchema,
  workspaceMemberUpdateSchema,
  workspaceUpdateSchema,
} from "./workspace.schema.js";

export const validateWorkspaceId = (req, res, next) => {
  const result = workspaceIdSchema.safeParse(req.params);

  if (!result.success) {
    console.error("Invalid workspace ID:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace ID.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateWorkspaceUpdate = (req, res, next) => {
  const result = workspaceUpdateSchema.safeParse(req.body);

  if (!result.success) {
    console.error("Invalid workspace update:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace update.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateWorkspaceMemberCreate = (req, res, next) => {
  const result = workspaceMemberCreateSchema.safeParse(req.body);

  if (!result.success) {
    console.error("Invalid workspace member:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace member.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateWorkspaceMemberUserId = (req, res, next) => {
  const result = workspaceMemberUserIdSchema.safeParse(req.params);

  if (!result.success) {
    console.error("Invalid workspace member user ID:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace member user ID.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateWorkspaceMemberUpdate = (req, res, next) => {
  const result = workspaceMemberUpdateSchema.safeParse({
    ...req.params,
    ...req.body,
  });

  if (!result.success) {
    console.error("Invalid workspace member update:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace member update.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};

export const validateWorkspaceMemberDelete = (req, res, next) => {
  const result = workspaceMemberDeleteSchema.safeParse(req.params);

  if (!result.success) {
    console.error("Invalid workspace member delete:", result.error);

    return res.status(400).json({
      success: false,
      message: "Invalid workspace member delete.",
      errors: z.treeifyError(result.error),
    });
  }

  next();
};
