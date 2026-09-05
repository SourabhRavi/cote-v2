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

  const message = await db.orm.public.Message.create({
    authorId: userId,
    channelId,
    content,
  });

  const author = await db.orm.public.User.first({
    id: userId,
  });

  return {
    author,
    ...message,
  };
};

export const getMessages = async ({
  userId,
  channelId,
  cursor,
  limit = 20,
}) => {
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

  let query = db.orm.public.Message.where({
    channelId,
  })
    .include("author")
    .orderBy((message) => message.id.desc())
    .limit(limit + 1);

  if (cursor) {
    query = query.cursor({ id: cursor });
  }

  const messages = await query.all();

  const hasMore = messages.length > limit;
  const pageMessages = messages.slice(0, limit);

  const nextCursor = hasMore ? pageMessages[pageMessages.length - 1].id : null;

  const formattedMessages = pageMessages.map((message) => ({
    ...message,
    content: message.deletedAt ? null : message.content,
  }));

  return {
    messages: formattedMessages,
    nextCursor,
    hasMore,
  };
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
  })
    .include("author")
    .update({
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
  })
    .include("author")
    .update({
      deletedAt: new Date(),
    });
};
