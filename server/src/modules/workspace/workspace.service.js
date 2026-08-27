import { db } from "../../prisma/db.ts";

export const createWorkspace = async ({ createdByUserId, name }) => {
  return db.transaction(async (tx) => {
    const workspace = await tx.orm.public.Workspace.create({
      createdByUserId,
      name,
    });

    await createWorkspaceMember(tx.orm, {
      createdByUserId,
      workspaceId: workspace.id,
      role: "owner",
    });

    return workspace;
  });
};

const createWorkspaceMember = async (orm, { userId, workspaceId, role }) => {
  return orm.public.WorkspaceMember.create({
    userId,
    workspaceId,
    role,
  });
};

export const getWorkspaces = async ({ userId }) => {
  return db.orm.public.Workspace.where((w) =>
    w.workspaceMembers.some((member) => member.userId.eq(userId)),
  ).all();
};

export const getWorkspace = async ({ userId, workspaceId }) => {
  return db.orm.public.Workspace.where((w) =>
    w.workspaceMembers.some((member) => member.userId.eq(userId)),
  ).first({
    id: workspaceId,
  });
};

export const updateWorkspace = async ({ userId, workspaceId, name }) => {
  const workspace = await getWorkspace({
    userId,
    workspaceId,
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  return db.orm.public.Workspace.where({ id: workspace.id }).update({
    name: name,
  });
};

export const getWorkspaceMember = async ({ userId, workspaceId }) => {
  return db.orm.public.WorkspaceMember.where({
    userId,
    workspaceId,
  }).first();
};

export const addWorkspaceMember = async ({
  userId,
  workspaceId,
  memberUserId,
  role,
}) => {
  const workspaceMember = await getWorkspaceMember({
    userId,
    workspaceId,
  });

  if (!workspaceMember) {
    throw new Error("Workspace not found.");
  }

  if (!["owner", "admin"].includes(workspaceMember.role)) {
    throw new Error("Insufficient permissions for adding member.");
  }

  const existingMember = await getWorkspaceMember({
    userId: memberUserId,
    workspaceId,
  });

  if (existingMember) {
    throw new Error("User is already a member of this workspace.");
  }

  return createWorkspaceMember(db.orm, {
    memberUserId,
    workspaceId: workspace.id,
    role: role,
  });
};
