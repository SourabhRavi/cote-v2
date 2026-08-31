import { db } from "../../prisma/db.ts";

export const sendMessage = async ({ userId, channelId, content }) => {
  const channel = await db.orm.public.Channel.first({
    id: channelId,
  });

  if (!channel) {
    throw new Error("Channel not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    userId,
    workspaceId: channel.workspaceId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  return db.orm.public.Message.create({
    authorId: userId,
    channelId,
    content,
  });
};

export const getMessages = async ({ userId, channelId }) => {
  const channel = await db.orm.public.Channel.first({
    id: channelId,
  });

  if (!channel) {
    throw new Error("Channel not found.");
  }

  const workspaceMember = await db.orm.public.WorkspaceMember.first({
    userId,
    workspaceId: channel.workspaceId,
  });

  if (!workspaceMember) {
    throw new Error("User is not a member of this workspace.");
  }

  const messages = await db.orm.public.Message.all({
    channelId,
  });

  return messages.map((message) => ({
    ...message,
    content: message.deletedAt ? null : message.content,
  }));
};

export const updateMessage = async ({ userId, messageId, content }) => {
  const message = await db.orm.public.Message.first({
    id: messageId,
  });

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.authorId !== userId) {
    throw new Error("Insufficient permissions for updating message.");
  }

  return db.orm.public.Message.where({
    id: messageId,
  }).update({
    content,
  });
};

export const deleteMessage = async ({ userId, messageId }) => {
  const message = await db.orm.public.Message.first({
    id: messageId,
  });

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.authorId !== userId) {
    throw new Error("Insufficient permissions for deleting message.");
  }

  return db.orm.public.Message.where({
    id: messageId,
  }).update({
    deletedAt: new Date(),
  });
};
