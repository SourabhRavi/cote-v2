import { Router } from "express";
import {
  addWorkspaceMember,
  createWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "./workspace.service.js";
import {
  validateWorkspaceId,
  validateWorkspaceMemberCreate,
  validateWorkspaceUpdate,
} from "./workspace.middleware.js";

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

router.get("/:workspaceId", validateWorkspaceId, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId } = req.params;

  try {
    const workspace = await getWorkspace({
      userId: userId,
      workspaceId: workspaceId,
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

router.patch(
  "/:workspaceId",
  validateWorkspaceId,
  validateWorkspaceUpdate,
  async (req, res) => {
    const { id: userId } = req.user;
    const { workspaceId } = req.params;
    const { name } = req.body;

    try {
      await updateWorkspace({
        userId: userId,
        workspaceId: workspaceId,
        name: name,
      });

      return res.status(200).json({
        success: true,
        message: "Workspace updated.",
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
      return res.status(500).send("Failed to update workspace.");
    }
  },
);

router.post(
  "/:workspaceId/members",
  validateWorkspaceId,
  validateWorkspaceMemberCreate,
  async (req, res) => {
    const { id: userId } = req.user;
    const { workspaceId } = req.params;
    const { userId: memberUserId, role } = req.body;

    try {
      await addWorkspaceMember({
        userId: userId,
        workspaceId: workspaceId,
        memberUserId: memberUserId,
        role: role,
      });

      return res.status(201).json({
        success: true,
        message: "Workspace member added.",
      });
    } catch (error) {
      console.error("Failed to add workspace member:", error);
      return res.status(500).send("Failed to add workspace member.");
    }
  },
);

export default router;
