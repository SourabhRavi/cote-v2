import { db } from "../../prisma/db.ts";

export const createChannel = async ({ userId, workspaceId, channelName }) => {
  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  const channel = await db.orm.public.Channel.create({
    workspaceId,
    name: channelName,
  });

  // The user who creates the channel automatically becomes a member.
  await db.orm.public.ChannelMember.create({
    channelId: channel.id,
    userId,
  });

  return channel;
};

export const getChannels = async ({ userId, workspaceId }) => {
  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    workspaceId,
    userId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  return db.orm.public.Channel.where({
    workspaceId,
  }).all();
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
    throw new Error("User is not a member of this workspace.");
  }

  return channel;
};

export const joinChannel = async ({ userId, channelId }) => {
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
    throw new Error("User is not a member of this workspace.");
  }

  const existingChannelMember = await db.orm.public.ChannelMember.first({
    channelId,
    userId,
  });

  if (existingChannelMember) {
    return existingChannelMember;
  }

  return db.orm.public.ChannelMember.create({
    channelId,
    userId,
  });
};

export const leaveChannel = async ({ userId, channelId }) => {
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
    throw new Error("User is not a member of this workspace.");
  }

  const channelMember = await db.orm.public.ChannelMember.first({
    channelId,
    userId,
  });

  if (!channelMember) {
    throw new Error("User is not a member of this channel.");
  }

  return db.orm.public.ChannelMember.delete({
    id: channelMember.id,
  });
};

export const updateChannel = async ({ userId, channelId, channelName }) => {
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
    throw new Error("User is not a member of this workspace.");
  }

  return db.orm.public.Channel.where({
    id: channelId,
  }).update({
    name: channelName,
  });
};

export const markChannelAsRead = async ({ userId, channelId }) => {
  const channelMember = await db.orm.public.ChannelMember.first({
    userId,
    channelId,
  });

  if (!channelMember) {
    throw new Error("User is not a member of this channel.");
  }

  return db.orm.public.ChannelMember.where({
    channelId: channelMember.id,
  }).update({
    lastReadAt: new Date().toISOString(),
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
    throw new Error("User is not a member of this workspace.");
  }

  if (workspaceMember.role !== "owner") {
    throw new Error("Insufficient permissions for deleting channel.");
  }

  return db.orm.public.Channel.delete({
    id: channelId,
  });
};
