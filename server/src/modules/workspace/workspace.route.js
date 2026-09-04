import { Router } from "express";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspaceMember,
  getUnreadCounts,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  updateWorkspace,
  updateWorkspaceMember,
} from "./workspace.service.js";
import {
  validateWorkspaceId,
  validateWorkspaceMemberCreate,
  validateWorkspaceMemberDelete,
  validateWorkspaceMemberUpdate,
  validateWorkspaceUpdate,
} from "./workspace.middleware.js";

const router = Router();

router.post("/", async (req, res) => {
  const { id } = req.user;
  console.log("body///", req.body);
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
      userId,
    });

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    return res.status(500).send("Failed to fetch workspaces.");
  }
});

router.get("/:workspaceId", validateWorkspaceId, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId } = req.params;

  try {
    const workspace = await getWorkspace({
      userId,
      workspaceId,
    });

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("Failed to fetch workspace:", error);
    return res.status(500).send("Failed to fetch workspace.");
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
        userId,
        workspaceId,
        name,
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
    const { memberUserId, role } = req.body;

    try {
      await addWorkspaceMember({
        userId,
        workspaceId,
        memberUserId,
        role,
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

router.get("/:workspaceId/members", validateWorkspaceId, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId } = req.params;

  try {
    const workspaceMemebers = await getWorkspaceMembers({
      userId,
      workspaceId,
    });

    return res.status(200).json({
      success: true,
      data: workspaceMemebers,
    });
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return res.status(500).send("Failed to fetch workspace members.");
  }
});

router.patch(
  "/:workspaceId/members/:memberUserId",
  validateWorkspaceMemberUpdate,
  async (req, res) => {
    const { id: userId } = req.user;
    const { workspaceId, memberUserId } = req.params;
    const { role } = req.body;

    try {
      await updateWorkspaceMember({
        userId,
        workspaceId,
        memberUserId,
        role,
      });

      return res.status(200).json({
        success: true,
        message: "Workspace member role updated.",
      });
    } catch (error) {
      console.error("Failed to update workspace member:", error);
      return res.status(500).send("Failed to update workspace member.");
    }
  },
);

router.get("/:workspaceId/unread", validateWorkspaceId, async (req, res) => {
  const { id: userId } = req.user;
  const { workspaceId } = req.params;

  try {
    const unreadCounts = await getUnreadCounts({ userId, workspaceId });

    return res.status(200).json({
      success: true,
      data: unreadCounts,
    });
  } catch (error) {
    console.error("Failed to get unread counts of channels:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread counts of channels.",
    });
  }
});

router.delete(
  "/:workspaceId/members/:memberUserId",
  validateWorkspaceMemberDelete,
  async (req, res) => {
    const { id: userId } = req.user;
    const { workspaceId, memberUserId } = req.params;

    try {
      await deleteWorkspaceMember({
        userId,
        workspaceId,
        memberUserId,
      });

      return res.status(200).json({
        success: true,
        message: "Workspace member role updated.",
      });
    } catch (error) {
      console.error("Failed to update workspace member:", error);
      return res.status(500).send("Failed to update workspace member.");
    }
  },
);

export default router;
