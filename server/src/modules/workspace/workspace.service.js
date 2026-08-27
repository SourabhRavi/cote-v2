import { db } from "../../prisma/db.ts";

export const createWorkspace = async ({ createdByUserId, name }) => {
  return db.transaction(async (tx) => {
    const workspace = await tx.orm.public.Workspace.create({
      createdByUserId,
      name,
    });

    await createWorkspaceMember(tx, {
      userId: createdByUserId,
      workspaceId: workspace.id,
      role: "owner",
    });

    return workspace;
  });
};

const createWorkspaceMember = async (tx, { userId, workspaceId, role }) => {
  return tx.orm.public.WorkspaceMember.create({
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
