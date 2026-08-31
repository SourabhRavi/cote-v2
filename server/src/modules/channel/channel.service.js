import { db } from "../../prisma/db.ts";

export const createChannel = async ({ userId, workspaceId, name }) => {
  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  return db.orm.public.Channel.create({
    workspaceId,
    name,
  });
};

export const getChannels = async ({ userId, workspaceId }) => {
  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  return db.orm.public.Channel.all({
    workspaceId,
  });
};

export const getChannel = async ({ userId, channelId }) => {
  const channel = await db.orm.public.Channel.first({
    id: channelId,
  });

  if (!channel) {
    throw new Error("Channel not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId: channel.workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("Channel not found.");
  }

  return channel;
};

export const updateChannel = async ({ userId, channelId, name }) => {
  const channel = await db.orm.public.Channel.first({
    id: channelId,
  });

  if (!channel) {
    throw new Error("Channel not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId: channel.workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("Channel not found.");
  }

  return db.orm.public.Channel.update({
    name,
  });
};

export const deleteChannel = async ({ userId, channelId }) => {
  const channel = await db.orm.public.Channel.first({
    id: channelId,
  });

  if (!channel) {
    throw new Error("Channel not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId: channel.workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("Channel not found.");
  }

  if (workspaceMember.role !== "owner") {
    throw new Error("Insufficient permissions for deleting channel.");
  }

  return db.orm.public.Channel.delete({
    id: channelId,
  });
};
