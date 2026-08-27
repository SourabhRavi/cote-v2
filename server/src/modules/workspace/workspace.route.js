import { Router } from "express";
import {
  createWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "./workspace.service.js";
import {
  workspaceIdSchema,
  workspaceUpdateSchema,
} from "./workspace.schema.js";

const router = Router();

router.post("/", async (req, res) => {
  const { id } = req.user;
  const { workspaceName } = req.body;

  if (!workspaceName) {
    console.error("Workspace name is required.");
    return res.status(400).send("Workspace name is required.");
  }

  try {
    await createWorkspace({
      createdByUserId: id,
      name: workspaceName,
    });

    return res.status(201).json({
      message: "Workspace created.",
    });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    return res.status(500).send("Failed to create workspace.");
  }
});

router.get("/", async (req, res) => {
  const { id: userId } = req.user;

  try {
    const workspaces = await getWorkspaces({
      userId: userId,
    });

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    console.error("Failed to get workspaces:", error);
    return res.status(500).send("Failed to get workspaces.");
  }
});

router.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;

  const { id: userId } = req.user;

  const {
    data: validated,
    success,
    error,
  } = workspaceIdSchema.safeParse({
    workspaceId: workspaceId,
  });

  if (!success) {
    console.error("Invalid workspace ID:", error);
    return res.status(400).send("Invalid workspace ID.");
  }

  try {
    const workspace = await getWorkspace({
      userId: userId,
      workspaceId: validated.workspaceId,
    });

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Failed to get workspace:", error);
    return res.status(500).send("Failed to get workspace.");
  }
});

router.patch("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;

  const { id: userId } = req.user;

  const { name } = req.body;

  const workspaceIdResult = workspaceIdSchema.safeParse(workspaceId);

  if (!workspaceIdResult.success) {
    console.error("Invalid workspace ID:", workspaceIdResult.error);
    return res.status(400).send("Invalid workspace ID.");
  }

  const workspaceUpdateResult = workspaceUpdateSchema.safeParse(name);

  if (!workspaceUpdateResult.success) {
    console.error("Invalid workspace update:", workspaceUpdateResult.error);

    return res.status(400).send("Invalid workspace update.");
  }

  try {
    await updateWorkspace({
      userId: userId,
      workspaceId: workspaceIdResult.data.workspaceId,
      name: workspaceUpdateResult.data.name,
    });

    return res.status(200).json({
      success: true,
      message: "Workspace updated.",
    });
  } catch (error) {
    console.error("Failed to update workspace:", error);
    return res.status(500).send("Failed to update workspace.");
  }
});

export default router;
