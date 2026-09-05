import { api } from "@/lib/axios.ts";
import type { MessageResponse } from "@/types/message.types.ts";

export const getMessages = async (
  channelId: string,
  cursor?: string,
  limit = 20,
): Promise<MessageResponse> => {
  const response = await api.get(`/messages`, {
    params: {
      channelId,
      cursor,
      limit,
    },
  });

  return response.data.data;
};

export const sendMessage = async (channelId: string, content: string) => {
  const response = await api.post(`/messages`, {
    channelId,
    content,
  });

  return response.data.data;
};

export const updateMessage = async (messageId: string, content: string) => {
  const response = await api.patch(`/messages/${messageId}`, {
    content,
  });

  return response.data.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/messages/${messageId}`);

  return response.data.data;
};
