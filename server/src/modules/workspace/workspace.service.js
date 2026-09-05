import { db } from "../../prisma/db.ts";
import { getChannels } from "../channel/channel.service.js";

export const createWorkspace = async ({ createdByUserId, name }) => {
  return db.transaction(async (tx) => {
    const workspace = await tx.orm.public.Workspace.create({
      createdByUserId,
      name,
    });

    await createWorkspaceMember(tx.orm, {
      userId: createdByUserId,
      workspaceId: workspace.id,
      role: "owner",
    });

    const generalChannel = await tx.orm.public.Channel.create({
      workspaceId: workspace.id,
      name: "general",
    });

    await tx.orm.public.ChannelMember.create({
      channelId: generalChannel.id,
      userId: createdByUserId,
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
    throw new Error("User is not a member of this workspace.");
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
    throw new Error("User is not a member of this workspace.");
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

  const member = await createWorkspaceMember(db.orm, {
    userId: memberUserId,
    workspaceId,
    role,
  });

  const generalChannel = await db.orm.public.Channel.where({
    workspaceId,
    name: "general",
  }).first();

  if (generalChannel) {
    await db.orm.public.ChannelMember.create({
      channelId: generalChannel.id,
      userId: memberUserId,
    });
  }

  return member;
};

export const getWorkspaceMembers = async ({ userId, workspaceId }) => {
  const existingMember = await getWorkspaceMember({
    userId,
    workspaceId,
  });

  if (!existingMember) {
    throw new Error("User is not member of this workspace.");
  }

  return db.orm.public.WorkspaceMember.where({
    workspaceId,
  }).all();
};

export const updateWorkspaceMember = async ({
  userId,
  workspaceId,
  memberUserId,
  role,
}) => {
  const requestingWorkspaceMember = await getWorkspaceMember({
    userId,
    workspaceId,
  });

  if (!requestingWorkspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  if (!["owner", "admin"].includes(requestingWorkspaceMember.role)) {
    throw new Error("User is not authorized to update member roles.");
  }

  const targetWorkspaceMember = await getWorkspaceMember({
    userId: memberUserId,
    workspaceId,
  });

  if (!targetWorkspaceMember) {
    throw new Error("Workspace member not found.");
  }

  return db.orm.public.WorkspaceMember.where({
    workspaceId,
    userId: memberUserId,
  }).update({
    role: role,
  });
};

export const getUnreadCounts = async ({ userId, workspaceId }) => {
  const unreadCounts = await db.orm.public.Message.where((m) =>
    m.channel.some(
      (c) =>
        c.workspaceId.eq(workspaceId) &&
        c.channelMembers.some(
          (cm) =>
            cm.userId.eq(userId) &&
            (cm.lastReadAt.isNull() ||
              cm.lastReadAt.lt(m.createdAt) ||
              cm.lastReadAt.lt(m.updatedAt)),
        ),
    ),
  )
    .groupBy("channelId")
    .aggregate((agg) => ({ count: agg.count() }));

  return unreadCounts;
};

export const deleteWorkspaceMember = async ({
  userId,
  workspaceId,
  memberUserId,
}) => {
  const requestingWorkspaceMember = await getWorkspaceMember({
    userId,
    workspaceId,
  });

  if (!requestingWorkspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  // check if requestingWorkspaceMember has permission to delete
  if (!["owner", "admin"].includes(requestingWorkspaceMember.role)) {
    throw new Error("User is not authorized to delete members.");
  }

  const targetWorkspaceMember = await getWorkspaceMember({
    userId: memberUserId,
    workspaceId,
  });

  if (!targetWorkspaceMember) {
    throw new Error("Workspace member not found.");
  }

  // check if targetWorkspaceMember is not an owner: owner cannot be deleted
  if (targetWorkspaceMember.role === "owner") {
    throw new Error("Only the workspace owner can delete the owner.");
  }

  return db.orm.public.WorkspaceMember.delete({
    workspaceId,
    userId: memberUserId,
  });
};
export const createWorkspaceInvitation = async ({
  userId,
  workspaceId,
  userEmail,
}) => {
  const workspace = await db.orm.public.Workspace.first({
    id: workspaceId,
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    userId,
    workspaceId,
  });

  if (!workspaceMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (workspaceMember.role !== "owner" && workspaceMember.role !== "admin") {
    throw new Error("You do not have permission to invite members.");
  }

  const email = userEmail.trim().toLowerCase();

  const user = await db.orm.public.User.first({
    email,
  });

  if (user) {
    const existingMember = await db.orm.public.WorkspaceMember.first({
      userId: user.id,
      workspaceId,
    });

    if (existingMember) {
      throw new Error("User is already a workspace member.");
    }
  }

  const existingInvitation = await db.orm.public.WorkspaceInvitation.first({
    workspaceId,
    userEmail: email,
  });

  if (existingInvitation) {
    if (existingInvitation.status === "invited") {
      throw new Error("User has already been invited.");
    }

    return db.orm.public.WorkspaceInvitation.update(existingInvitation.id, {
      status: "invited",
    });
  }

  return db.orm.public.WorkspaceInvitation.create({
    workspaceId,
    userEmail: email,
  });
};

export const getWorkspaceInvitations = async ({ userEmail }) => {
  const email = userEmail.trim().toLowerCase();

  return db.orm.public.WorkspaceInvitation.where({
    userEmail: email,
    status: "invited",
  })
    .include("workspace")
    .all();
};

export const acceptWorkspaceInvitation = async ({ userId, invitationId }) => {
  const user = await db.orm.public.User.first({
    id: userId,
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const invitation = await db.orm.public.WorkspaceInvitation.first({
    id: invitationId,
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  const userEmail = user.email.trim().toLowerCase();
  const invitationEmail = invitation.userEmail.trim().toLowerCase();

  if (userEmail !== invitationEmail) {
    throw new Error("This invitation does not belong to you.");
  }

  if (invitation.status !== "invited") {
    throw new Error("Invitation is no longer active.");
  }

  const existingMember = await db.orm.public.WorkspaceMember.first({
    userId,
    workspaceId: invitation.workspaceId,
  });

  if (!existingMember) {
    await db.orm.public.WorkspaceMember.create({
      userId,
      workspaceId: invitation.workspaceId,
      role: "member",
    });
  }

  await db.orm.public.WorkspaceInvitation.where({
    id: invitation.id,
  }).update({
    status: "accepted",
  });

  return {
    workspaceId: invitation.workspaceId,
  };
};

export const declineWorkspaceInvitation = async ({ userId, invitationId }) => {
  const user = await db.orm.public.User.first({
    id: userId,
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const invitation = await db.orm.public.WorkspaceInvitation.first({
    id: invitationId,
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  const userEmail = user.email.trim().toLowerCase();
  const invitationEmail = invitation.userEmail.trim().toLowerCase();

  if (userEmail !== invitationEmail) {
    throw new Error("This invitation does not belong to you.");
  }

  if (invitation.status !== "invited") {
    throw new Error("Invitation is no longer active.");
  }

  await db.orm.public.WorkspaceInvitation.where({
    id: invitation.id,
  }).update({
    status: "declined",
  });
};
